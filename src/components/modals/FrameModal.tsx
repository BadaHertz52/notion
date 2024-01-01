import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  CSSProperties,
} from "react";

import {
  ModalPortal,
  Menu,
  CommentInput,
  Comments,
  Rename,
  MobileMenu,
} from "../index";
import { EditableBlockProps } from "../block/EditableBlock";
import { CommentInputProps } from "../comment/CommentInput";
import { MobileMenuProps } from "../menu/MobileMenu";
import { MenuProps } from "../menu/Menu";
import { RenameProps } from "../Rename";

import { useModal } from "../../hooks";
import { ModalType, Page } from "../../types";
import {
  changeModalStyleOnTopOfBlock,
  findPage,
  getBlockDomRect,
} from "../../utils";

type ChildrenProps = MenuProps &
  RenameProps &
  CommentInputProps &
  EditableBlockProps &
  MobileMenuProps;
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
};

const FrameModal = ({ ...props }: FrameModalProps) => {
  const { modal } = props;
  const correctEventTargets = [
    "#block-quick-menu",
    "#menu",
    ".comments-bubble",
    ".btn-comment",
    ".comment__tool-more",
    ".comment__btn-submit",
    ".text__btn-comment",
    "#mobile-menu",
    "#mobile-side-menu",
    "#modal-mobile-side-menu",
    ".comment-input",
    "#block-comments",
  ];

  if (modal.target === "mobileMenu" && modal.block)
    correctEventTargets.push(`#block-${modal.block.id}`);

  const modalOpen = useModal(correctEventTargets, "frame");

  const ID = "modal-frame";

  const [modalStyle, setModalStyle] = useState<CSSProperties | undefined>(
    undefined
  );

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
          width: blockDomRect.width,
        });
      }
    }
  }, [modal.block]);

  const changeMenuModalStyle = useCallback(() => {
    const blockQuickMenuEl = document.getElementById("block-quick-menu");
    const blockQuickMenuElDomRect = blockQuickMenuEl?.getClientRects()[0];
    if (blockQuickMenuElDomRect) {
      const { top, right } = blockQuickMenuElDomRect;
      const MENU_HEIGHT = 275;
      const EXTRA_SPACE = 20;
      const isOver = window.innerHeight - top - MENU_HEIGHT <= EXTRA_SPACE;
      const modalTop = isOver ? top - MENU_HEIGHT : top;
      setModalStyle({
        position: "absolute",
        top: modalTop,
        left: right,
      });
    }
  }, []);

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
      case "mobileMenu":
        changeModalStyleOnTopOfBlock(modal, setModalStyle);
        break;
      default:
        break;
    }
  }, [modal, changeStyleOfModalOnBottomBlock, changeMenuModalStyle]);

  const handleScrollOfFrame = useCallback((open: boolean) => {
    const frameEl = document.querySelector(".frame");
    frameEl?.classList.toggle("stop", open);
  }, []);

  const handleCloseModal = useCallback(() => {
    //blockStyler는 sideMenu 문제로 blockStyler에서 다룸
    if (modal.open && modal.target !== "blockStyler") {
      props.closeModal();
    }
  }, [props, modal]);

  useEffect(() => {
    changeModalStyle();
  }, [modal, changeModalStyle]);

  useEffect(() => {
    handleScrollOfFrame(true);
    return () => {
      handleScrollOfFrame(false);
    };
  }, [handleScrollOfFrame]);

  useEffect(() => {
    if (modalOpen.frame === false) handleCloseModal();
  }, [modalOpen.frame, modal.target, handleCloseModal]);

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
          pages={props.pages}
          pagesId={props.pagesId}
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
          />
        </div>
      )}

      {modal.target === "mobileMenu" && modal.block && (
        <MobileMenu {...props} block={modal.block} />
      )}
    </ModalPortal>
  );
};

export default React.memo(FrameModal);
