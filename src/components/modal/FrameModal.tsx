import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  CSSProperties,
} from "react";

import { ModalPortal, Menu, CommentInput, Comments, Rename } from "../index";
import { CommentInputProps } from "../comment/CommentInput";
import { MenuProps } from "../menu/Menu";
import { RenameProps } from "../Rename";

import { ModalType, Page } from "../../types";
import { findPage, getBlockDomRect, isInTarget } from "../../utils";
import { EditableBlockProps } from "../block/EditableBlock";

type ChildrenProps = MenuProps &
  RenameProps &
  CommentInputProps &
  EditableBlockProps;
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
      default:
        break;
    }
  }, [modal, changeStyleOfModalOnBottomBlock, changeMenuModalStyle]);

  const handleScrollOfFrame = useCallback(() => {
    const frameEl = document.querySelector(".frame");
    frameEl?.classList.toggle("stop", modal.open);
  }, [modal.open]);

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
        if (!isInModal) {
          props.closeModal();
        }
      }
    },
    [props, modal]
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
      {/*
        {modal.target === "pageMenu" && (
          <PageMenu
            style={modalStyle}
            what="block"
            currentPage={page}
            pages={pages}
            firstList={firstList}
            closeMenu={() => setModal({ open: false, what: null })}
          />
        )}
        {modal.target === "movingTargetBlock" && movingTargetBlock && (
          <MovingTargetBlock
            key={movingTargetBlock.id}
            pages={pages}
            pagesId={pagesId}
            page={page}
            block={movingTargetBlock}
            fontSize={fontSize}
            isMoved={isMoved}
            setMovingTargetBlock={setMovingTargetBlock}
            pointBlockToMoveBlock={pointBlockToMoveBlock}
            command={command}
            setCommand={setCommand}
            openComment={openComment}
            setOpenComment={setOpenComment}
            setCommentBlock={setCommentBlock}
            setOpenLoader={setOpenLoader}
            setLoaderTargetBlock={setLoaderTargetBlock}
            closeMenu={closeMenu}
            templateHtml={templateHtml}
            setSelection={setSelection}
            setMobileMenuTargetBlock={setMobileMenuTargetBlock}
            mobileMenuTargetBlock={mobileMenuTargetBlock}
          />
        )}
                {modal.target === "blockStyler" && selection && !isMobile() && (
          <BlockStyler
            pages={pages}
            pagesId={pagesId}
            firstList={firstList}
            userName={userName}
            page={page}
            recentPagesId={recentPagesId}
            block={selection.block}
            modal={modal}
            setModal={setModal}
            setModalStyle={setModalStyle}
            command={command}
            setCommand={setCommand}
            setCommentBlock={setCommentBlock}
            selection={selection}
            setSelection={setSelection}
            frameHtml={frameHtml}
            setMobileSideMenu={setMobileSideMenu}
            setMobileMenuTargetBlock={setMobileMenuTargetBlock}
            setOpenMobileBlockStyler={null}
          />
        )}
      */}
    </ModalPortal>
  );
};

export default React.memo(FrameModal);
