import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ModalPortal, AllComments, TopBarToolMore, PageMenu } from "../index";
import { AllCommentsProps } from "../comment/AllComments";
import { TopBarToolMoreProps } from "../topBar/TopBarToolMore";

import { ModalType } from "../../types";
import { isInTarget, isMobile } from "../../utils";
import { PageMenuProps } from "../pageMenu/PageMenu";

type TopBarModalProps = AllCommentsProps &
  Omit<PageMenuProps, "what" | "currentPage"> &
  TopBarToolMoreProps & {
    modal: ModalType;
    closeModal: () => void;
  };

const TopBarModal = ({ ...props }: TopBarModalProps) => {
  const { modal, closeModal } = props;
  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);

  const INITIAL_ALL_COMMENTS_STYLE: CSSProperties = useMemo(
    () =>
      isMobile()
        ? {
            position: "absolute",
            top: "100vh",
            left: 0,
          }
        : {
            position: "absolute",
            top: 0,
            right: "-400px",
          },
    []
  );

  const changeStyleForAllComments = useCallback(() => {
    setStyle(INITIAL_ALL_COMMENTS_STYLE);
    setTimeout(() => {
      setStyle((prev) =>
        isMobile()
          ? { ...prev, top: 0 }
          : {
              ...prev,
              right: 0,
            }
      );
    }, 500);
  }, [setStyle, INITIAL_ALL_COMMENTS_STYLE]);

  const changeOtherStyle = useCallback(() => {
    const topBarDomRect = document
      .querySelector("#top-bar")
      ?.getClientRects()[0];

    if (topBarDomRect) {
      const { bottom } = topBarDomRect;
      setStyle({
        position: "absolute",
        top: bottom + 10,
        right: 30,
      });
    }
  }, []);

  const changeStyle = useCallback(() => {
    switch (modal.target) {
      case "allComments":
        changeStyleForAllComments();
        break;

      default:
        changeOtherStyle();
        break;
    }
  }, [modal.target, changeStyleForAllComments, changeOtherStyle]);

  const closeAllComments = useCallback(() => {
    setStyle(INITIAL_ALL_COMMENTS_STYLE);
    setTimeout(() => {
      console.log("close");
      closeModal();
    }, 2500);
  }, [setStyle, closeModal, INITIAL_ALL_COMMENTS_STYLE]);

  const handleClose = useCallback(
    (event: globalThis.MouseEvent) => {
      const TARGET = [
        "#all-commentsBtn",
        ".btn-page-tool-more",
        "#top-bar__tool",
        "#all-comments",
        "#page-meu",
        "#top-bar__tool-more",
      ];

      if (!TARGET.map((v) => isInTarget(event, v)).some((v) => v)) {
        modal.target === "allComments" ? closeAllComments() : closeModal();
      }
    },
    [modal.target, closeAllComments, closeModal]
  );

  useEffect(() => {
    document.addEventListener("click", handleClose);
    if (!style) changeStyle();

    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, [handleClose, changeStyle, style]);

  useEffect(() => {
    if (!modal.open && modal.target === "allComments") closeAllComments();
  }, [modal.open, modal.target, closeAllComments]);

  return (
    <ModalPortal isOpen={!!modal.target} id="modal-top-bar" style={style}>
      {modal.target === "allComments" && style && <AllComments {...props} />}
      {modal.target === "topBarToolMore" && style && (
        <TopBarToolMore {...props} />
      )}
      {modal.target === "pageMenu" && (
        <PageMenu {...props} what="page" currentPage={props.page} />
      )}
    </ModalPortal>
  );
};

export default React.memo(TopBarModal);
