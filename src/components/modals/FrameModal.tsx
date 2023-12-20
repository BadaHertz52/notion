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
} from "../index";
import { CommentInputProps } from "../comment/CommentInput";
import { MenuProps } from "../menu/Menu";
import { RenameProps } from "../Rename";

import { ModalType, Page } from "../../types";
import {
  findPage,
  getBlockDomRect,
  isInTarget,
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
  const { editBlock } = useContext(ActionContext).actions;

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
      const GAP = 10;
      const stylerHeight = 45;

      if (domeRect) {
        const top = domeRect.top - GAP - stylerHeight;
        const isOver = pageContentsElDomRect.top <= top;
        !isOver
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
      default:
        break;
    }
  }, [modal, changeStyleOfModalOnBottomBlock, changeMenuModalStyle]);

  const handleScrollOfFrame = useCallback(() => {
    const frameEl = document.querySelector(".frame");
    frameEl?.classList.toggle("stop", modal.open);
  }, [modal.open]);

  const isInBlockStyler = useCallback(
    (event: globalThis.MouseEvent) => {
      const isBlockStylerSideMenu = document.querySelector(
        "#blockStyler__sideMenu"
      );
      if (
        modal.target === "blockStyler" &&
        modal.block &&
        !isBlockStylerSideMenu
      ) {
        const target = [`#${modal.block.id}__contents`, "#blockStyler"];

        return target.map((v) => isInTarget(event, v)).some((v) => v);
      } else {
        return true;
      }
    },
    [modal]
  );

  const handleCloseBlockStyler = useCallback(() => {
    if (modal.block) {
      removeSelected(modal.block, editBlock, props.page);
    }
  }, [modal.block, props.page, editBlock]);

  const handleCloseModal = useCallback(
    (event: globalThis.MouseEvent) => {
      const target = [
        ".modal",
        ".menu",
        ".comments-bubble",
        ".btn-comment",
        ".comment__tool-more",
        ".comment__btn-submit",
      ];
      const isInModal = target
        .map((v) => !!isInTarget(event, v))
        .some((v) => v);
      if (modal.open) {
        if (!isInModal && !isInBlockStyler(event)) {
          handleCloseBlockStyler();
          props.closeModal();
        }
      }
    },
    [props, modal, isInBlockStyler]
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
    </ModalPortal>
  );
};

export default React.memo(FrameModal);
