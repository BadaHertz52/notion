import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  CSSProperties,
  useContext,
} from "react";

import {
  ModalPortal,
  Menu,
  CommentInput,
  Comments,
  Rename,
  BlockStyler,
  MobileMenu,
} from "../index";
import { CommentInputProps } from "../comment/CommentInput";
import { MenuProps } from "../menu/Menu";
import { RenameProps } from "../Rename";

import { ModalType, Page } from "../../types";
import {
  findPage,
  getBlockDomRect,
  isInTarget,
  isMobile,
  removeSelected,
} from "../../utils";
import { EditableBlockProps } from "../block/EditableBlock";
import { BlockStylerProps } from "../blockMenu/BlockStyler";
import ActionContext from "./../../contexts/ActionContext";

type ChildrenProps = MenuProps &
  RenameProps &
  CommentInputProps &
  EditableBlockProps &
  BlockStylerProps;
type FrameModalProps = Omit<
  ChildrenProps,
  | "block"
  | "pageId"
  | "currentPageId"
  | "closeRename"
  | "addOrEdit"
  | "mainComment"
  | "subComment"
  | "allComments"
  | "setModal"
> & {
  setModal: Dispatch<SetStateAction<ModalType>>;
  pagesId: string[];
  modal: ModalType;
  closeModal: () => void;
  templateHtml: HTMLElement | null;
};

const FrameModal = ({ ...props }: FrameModalProps) => {
  const { modal } = props;

  const ID = "modal-frame";

  const [modalStyle, setModalStyle] = useState<CSSProperties | undefined>(
    undefined
  );

  //TODO - modal style
  const changeStyleOfModalOnBottomBlock = useCallback(() => {
    if (modal.block) {
      const blockDomRect = getBlockDomRect(modal.block);
      const EXTRA_SPACE = 10;

      if (blockDomRect) {
        const top1 = blockDomRect.top + blockDomRect.height + EXTRA_SPACE;
        const top2 = `calc(${blockDomRect.top - EXTRA_SPACE}px - 100%) `;
        const remains = window.innerHeight - top1;

        setModalStyle({
          position: "absolute",
          top: remains > EXTRA_SPACE ? top1 : top2,
          left: blockDomRect.left,
        });
      }
    }
  }, [modal.block]);

  const changeMenuModalStyle = useCallback(() => {
    const blockFnEl = document.getElementById("blockFn");
    const blockFnElDomRect = blockFnEl?.getClientRects()[0];
    if (blockFnElDomRect) {
      const { top, right } = blockFnElDomRect;
      setModalStyle({
        position: "absolute",
        top: top,
        left: right,
      });
    }
  }, []);

  const changeBlockStylerModalStyle = useCallback(() => {
    const pageContentsEl = document.querySelector(".page__contents");
    const pageContentsElDomRect = pageContentsEl?.getClientRects()[0];

    if (modal.block && pageContentsElDomRect) {
      const domeRect = getBlockDomRect(modal.block);
      const topBarBottom = document.querySelector(".topBar")?.clientHeight;
      const GAP = 10;
      const STYLER_HEIGHT = 45;

      if (domeRect && topBarBottom) {
        const top = domeRect.top - GAP - STYLER_HEIGHT;
        const isOver = pageContentsElDomRect.top <= top;

        const isOverlap = top <= topBarBottom;

        (!isOver && isOverlap) || isMobile()
          ? setModalStyle({
              position: "absolute",
              top: top,
              left: pageContentsElDomRect.left,
            })
          : setModalStyle({
              position: "absolute",
              bottom: -domeRect.bottom - GAP,
              left: pageContentsElDomRect.left,
            });
      }
    }
  }, [modal.block]);

  const changeModalStyle = useCallback(() => {
    switch (modal.target) {
      case "rename":
        changeStyleOfModalOnBottomBlock();
        break;
      case "commentInput":
        changeStyleOfModalOnBottomBlock();
        break;
      case "comments":
        changeStyleOfModalOnBottomBlock();
        break;
      case "menu":
        changeMenuModalStyle();
        break;
      case "blockStyler":
        changeBlockStylerModalStyle();
        break;
      case "mobileMenu":
        changeBlockStylerModalStyle();
        break;
      default:
        break;
    }
  }, [
    modal,
    changeStyleOfModalOnBottomBlock,
    changeMenuModalStyle,
    changeBlockStylerModalStyle,
  ]);

  const handleScrollOfFrame = useCallback(() => {
    const frameEl = document.querySelector(".frame");
    frameEl?.classList.toggle("stop", modal.open);
  }, [modal.open]);

  const isInModal = useCallback((event: globalThis.MouseEvent) => {
    const target = [
      ".modal",
      "#menu",
      ".comments-bubble",
      ".btn-comment",
      ".comment__tool-more",
      ".comment__btn-submit",
      ".text_commentBtn",
      "#mobile-menu",
      "#mobile-side-menu",
    ];
    return target.map((v) => !!isInTarget(event, v)).some((v) => v);
  }, []);

  const isOpenMobileMenu = useCallback(
    (event: globalThis.MouseEvent) => {
      if (modal.block) {
        return (
          isInTarget(event, `#block-${modal.block.id}`) &&
          modal.target === "mobileMenu"
        );
      }
    },
    [modal.block, modal.target]
  );

  const handleCloseModal = useCallback(
    (event: globalThis.MouseEvent) => {
      //blockStyler는 sideMenu 문제로 blockStyler에서 다룸
      if (
        modal.open &&
        modal.target !== "blockStyler" &&
        !isInModal(event) &&
        !isOpenMobileMenu(event)
      ) {
        props.closeModal();
      }
    },
    [props, modal, isInModal, isOpenMobileMenu]
  );

  useEffect(() => {
    changeModalStyle();
  }, [modal, changeModalStyle]);

  useEffect(() => {
    handleScrollOfFrame();
    window.addEventListener("click", handleCloseModal);
    return () => {
      window.removeEventListener("click", handleCloseModal);
    };
  }, [handleCloseModal, handleScrollOfFrame]);

  return (
    <ModalPortal id={ID} isOpen={modal.open} style={modalStyle}>
      {modal.target === "menu" && modal.block && (
        <Menu {...props} block={modal.block} />
      )}
      {modal.target === "rename" && modal.block && (
        <Rename
          currentPageId={props.page.id}
          block={modal.block}
          page={findPage(props.pagesId, props.pages, modal.block.id) as Page}
          closeRename={props.closeModal}
        />
      )}
      {modal.target === "commentInput" && modal.block && (
        <CommentInput
          {...props}
          pageId={props.page.id}
          mainComment={null}
          subComment={null}
          commentBlock={modal.block}
          allComments={modal.block.comments}
          addOrEdit="add"
        />
      )}
      {modal.target === "comments" && modal.block?.comments && (
        <div id="block-comments">
          <Comments
            {...props}
            targetMainComments={modal.block.comments}
            block={modal.block}
            pageId={props.page.id}
            showAllComments={false}
          />
        </div>
      )}

      {modal.target === "blockStyler" && modal.block && (
        <BlockStyler {...props} block={modal.block} setModal={props.setModal} />
      )}
      {modal.target === "mobileMenu" && modal.block && (
        <MobileMenu {...props} block={modal.block} />
      )}
    </ModalPortal>
  );
};

export default React.memo(FrameModal);
