import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ModalPortal from "./ModalPortal";
import { ListItem, ModalType, Page } from "../../types";
import PageMenu from "../pageMenu/PageMenu";
import { findPage, isInTarget, isMobile } from "../../utils";
import { INITIAL_MODAL } from "../../constants";
import { CSSProperties } from "styled-components";
import Rename from "../Rename";

type SideBarModalProps = {
  sideModal: ModalType;
  setSideModal: Dispatch<SetStateAction<ModalType>>;
  pages: Page[];
  pagesId: string[];
  firstList: ListItem[];
};
const SideBarModal = ({ ...props }: SideBarModalProps) => {
  const { sideModal, setSideModal, pages, pagesId, firstList } = props;

  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);

  const closeModal = useCallback(() => {
    setSideModal(INITIAL_MODAL);
  }, [setSideModal]);

  const changeStyleInWeb = useCallback(() => {
    const { targetDomRect } = sideModal;

    if (targetDomRect) {
      switch (sideModal.target) {
        case "pageMenu":
          setStyle({
            position: "absolute",
            top: targetDomRect.top,
            left: targetDomRect.left,
          });
          break;
        case "rename":
          const el = document.querySelector(".item__inner.page-link");
          if (el) {
            setStyle({
              position: "absolute",
              top: targetDomRect.top + el.clientHeight,
              left: el.clientLeft + 16,
            });
          }

          break;
        default:
          break;
      }
    }
  }, [sideModal]);

  const changeStyleInMobile = useCallback(() => {
    setStyle({
      position: "absolute",
      top: "110vh",
      left: 0,
    });
    setTimeout(() => {
      setStyle((prev) => ({
        ...prev,
        top: sideModal.target === "pageMenu" ? 0 : "40vh",
      }));
    }, 500);
  }, [setStyle, sideModal]);

  const handleCloseModal = useCallback(
    (event: globalThis.MouseEvent) => {
      if (
        !isInTarget(event, "#sideBarModal__menu") &&
        !isInTarget(event, "#sideBar__moreFn")
      )
        closeModal();
    },
    [closeModal]
  );

  const closeModalInMobile = () => {
    setStyle({ ...style, top: "100vh" });
    setTimeout(() => {
      closeModal();
    }, 1000);
  };
  useEffect(() => {
    console.log(sideModal);
    sideModal.isMobile ? changeStyleInMobile() : changeStyleInWeb();
  }, [sideModal, changeStyleInMobile, changeStyleInWeb]);

  useEffect(() => {
    window.addEventListener("click", handleCloseModal);
    return () => {
      window.removeEventListener("click", handleCloseModal);
    };
  }, [handleCloseModal]);

  return (
    <ModalPortal id="sideBarModal" isOpen={sideModal.open} style={style}>
      {sideModal.isMobile && (
        <div className="topBar">
          <button onClick={closeModalInMobile}>close</button>
        </div>
      )}
      {sideModal.target === "pageMenu" && sideModal.pageId && (
        <PageMenu
          what="page"
          currentPage={findPage(pagesId, pages, sideModal.pageId)}
          pages={pages}
          firstList={firstList}
          closeMenu={sideModal.isMobile ? closeModalInMobile : closeModal}
        />
      )}
      {sideModal.target === "rename" && sideModal.pageId && (
        <div id="sideBarModal__renameOutBox">
          <Rename
            currentPageId={null}
            block={null}
            page={findPage(pagesId, pages, sideModal.pageId)}
            closeRename={sideModal.isMobile ? closeModalInMobile : closeModal}
          />
        </div>
      )}
    </ModalPortal>
  );
};

export default React.memo(SideBarModal);
