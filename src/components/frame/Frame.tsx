import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";

import { useSelector } from "react-redux";

import { ActionContext, ModalContext } from "../../contexts";
import {
  BlockQuickMenu,
  FrameInner,
  ModalPortal,
  FameModal,
  MovingBlockModal,
} from "../index";
import { RootState } from "../../modules";
import { Block, ModalType, Page, TemplateFrameCommonProps } from "../../types";
import { findBlock, isMobile } from "../../utils";

import "../../assets/frame.scss";
import { INITIAL_MODAL, SESSION_KEY } from "../../constants";

export type FrameProps = TemplateFrameCommonProps & {
  page: Page;
  openExport?: boolean;
};
/**
 * mouse drag로 위치를 변경시킬 블록의 내용을 보여주는 component
 * @param param0
 * @returns
 */

const Frame = ({ ...props }: FrameProps) => {
  const { page, openTemplates, fontStyle, smallText, fullWidth } = props;
  const sideAppear = useSelector((state: RootState) => state.side.appear);
  const { editPage, editBlock } = useContext(ActionContext).actions;
  const innerWidth = window.innerWidth;

  const inner = document.getElementById("notion__inner");
  const frameRef = useRef<HTMLDivElement>(null);
  const frameHtml = frameRef.current;
  const [templateHtml, setTemplateHtml] = useState<HTMLElement | null>(null);
  const firstBlocksId = page.firstBlocksId;
  const firstBlocks = firstBlocksId
    ? firstBlocksId.map((id: string) => findBlock(page, id).BLOCK)
    : null;
  const newPageFrame: boolean = page.firstBlocksId === null;

  const [blockQuickMenuModal, setBlockQuickMenuModal] =
    useState<ModalType>(INITIAL_MODAL);

  const [modal, setModal] = useState<ModalType>(INITIAL_MODAL);

  /**
   * page 내의 위치를 변경하는 대상이 되는  block
   */
  const [movingTargetBlock, setMovingTargetBlock] = useState<Block | null>(
    null
  );
  const [mobileMenuTargetBlock, setMobileMenuTargetBlock] =
    useState<Block | null>(null);

  const scrollbarWidth = 10;
  const sideBarEl = document.querySelector(".sideBar");
  const sideBarWidth =
    sideAppear === "lock" && sideBarEl ? sideBarEl.clientWidth : 0;
  const maxWidth = innerWidth - sideBarWidth - scrollbarWidth - 90;
  const fontSize: number = openTemplates ? 1.25 : smallText ? 0.8 : 1;
  const frameStyle: CSSProperties = {
    fontFamily: fontStyle,
    fontSize: `${fontSize}rem`,
  };
  const frameInnerStyle: CSSProperties = {
    width: isMobile()
      ? "90%"
      : openTemplates
      ? "100%"
      : fullWidth
      ? `${maxWidth}px`
      : innerWidth > 900
      ? "890px"
      : "75%",
  };

  const closeModal = () => {
    setModal(INITIAL_MODAL);
  };

  const changeBlockQuickMenuModal = (modal: ModalType) => {
    setBlockQuickMenuModal(modal);
  };

  const updateBlock = useCallback(() => {
    const item = sessionStorage.getItem(SESSION_KEY.blockToBeEdited);
    if (item) {
      const cursorElement = document.getSelection()?.anchorNode?.parentElement;
      const className = cursorElement?.className;
      const itemObjet = JSON.parse(item);
      const targetBlock: Block = itemObjet.block;
      const pageId = itemObjet.pageId;
      const condition =
        className === "editable" &&
        cursorElement &&
        cursorElement &&
        cursorElement.parentElement?.id === `${targetBlock.id}__contents`;
      if (!condition) {
        editBlock(pageId, targetBlock);
        sessionStorage.removeItem(SESSION_KEY.blockToBeEdited);
      }
    }
  }, [editBlock]);

  //selection
  const isValidatedSelection = useCallback((selection: Selection | null) => {
    if (selection) {
      const { anchorNode, focusNode, anchorOffset, focusOffset } = selection;

      const validateSelection =
        !(anchorNode === focusNode && anchorOffset === focusOffset) &&
        anchorNode?.nodeName === "#text" &&
        focusNode?.nodeName === "#text";
      return validateSelection;
    }
  }, []);

  const getBlockFromSelection = useCallback(
    (selection: Selection | null) => {
      let block;
      if (selection) {
        const { anchorNode } = selection;
        const blockId = anchorNode?.parentElement
          ?.closest(".block__contents")
          ?.id.replace("__contents", "");
        if (blockId) block = findBlock(page, blockId).BLOCK;
      }

      return block;
    },
    [page]
  );
  /**
   * 모바일 환경에서 변경된  selection 을 반영하는 기능
   */
  const handleSelectionChange = useCallback(
    (event: globalThis.Event) => {
      event.preventDefault();

      const selection = document.getSelection();
      const block = getBlockFromSelection(selection);

      const conditionAboutBlock =
        modal.target === "mobileMenu"
          ? block?.id === modal.block?.id
          : block?.id !== modal.block?.id;

      if (isValidatedSelection(selection) && conditionAboutBlock) {
        setModal({
          open: true,
          target: "blockStyler",
          block: block,
        });
      }
    },
    [isValidatedSelection, setModal, getBlockFromSelection, modal]
  );

  useEffect(() => {
    inner?.addEventListener("keyup", updateBlock);
    inner?.addEventListener("touchstart", updateBlock, { passive: true });
    return () => {
      inner?.removeEventListener("keyup", updateBlock);
      inner?.removeEventListener("touchstart", updateBlock);
    };
  }, [inner, updateBlock]);

  useEffect(() => {
    openTemplates
      ? setTemplateHtml(document.getElementById("template"))
      : setTemplateHtml(null);
  }, [openTemplates]);

  useEffect(() => {
    if (!newPageFrame && firstBlocksId) {
      const newFirstBlockHtml = document.getElementById(
        `${firstBlocksId[0]}__contentsId`
      );
      const contenteditableHtml = newFirstBlockHtml?.firstElementChild as
        | HTMLElement
        | null
        | undefined;
      if (contenteditableHtml) {
        contenteditableHtml.focus();
      }
    }
  }, [newPageFrame, firstBlocksId]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  const closeBlockQuickMenuModal = useCallback(() => {
    if (!(sideAppear === "lock" && window.innerWidth <= 768)) {
      setBlockQuickMenuModal(INITIAL_MODAL);
    }
  }, [setBlockQuickMenuModal, sideAppear]);

  useEffect(() => {
    closeBlockQuickMenuModal();
    window.addEventListener("resize", closeBlockQuickMenuModal);
    return () => {
      window.removeEventListener("resize", closeBlockQuickMenuModal);
    };
  }, [closeBlockQuickMenuModal]);

  return (
    <div
      className={`frame ${newPageFrame ? "newPageFrame" : ""} ${
        isMobile() ? "mobile" : "web"
      } ${modal.target === "export" ? "export__frame" : ""}`}
      style={frameStyle}
      ref={frameRef}
    >
      <ModalContext.Provider
        value={{
          changeModalState: (modal: ModalType) => setModal(modal),
          changeBlockQuickMenuModal: changeBlockQuickMenuModal,
        }}
      >
        <FrameInner
          userName={props.userName}
          pages={props.pages}
          pagesId={props.pagesId}
          firstBlocks={firstBlocks}
          page={page}
          frameRef={frameRef}
          fontSize={fontSize}
          templateHtml={templateHtml}
          newPageFrame={newPageFrame}
          setMovingTargetBlock={setMovingTargetBlock}
          frameInnerStyle={frameInnerStyle}
          closeModal={closeModal}
        />
        <ModalPortal
          id="modal-block-quick-menu"
          isOpen={blockQuickMenuModal.open}
        >
          {blockQuickMenuModal.block && (
            <BlockQuickMenu
              page={page}
              block={blockQuickMenuModal.block}
              movingTargetBlock={movingTargetBlock}
              setMovingTargetBlock={setMovingTargetBlock}
              modal={modal}
            />
          )}
        </ModalPortal>
        <FameModal
          page={page}
          pages={props.pages}
          pagesId={props.pagesId}
          firstList={props.firstList}
          recentPagesId={props.recentPagesId}
          userName={props.userName}
          frameHtml={frameHtml}
          templateHtml={templateHtml}
          fontSize={fontSize}
          modal={modal}
          setModal={setModal}
          closeModal={closeModal}
          editBlock={editBlock}
          editPage={editPage}
        />
      </ModalContext.Provider>
      {movingTargetBlock && (
        <MovingBlockModal
          isOpen={!!movingTargetBlock}
          pages={props.pages}
          pagesId={props.pagesId}
          page={page}
          templateHtml={templateHtml}
          block={movingTargetBlock}
          fontSize={fontSize}
          closeModal={() => setMovingTargetBlock(null)}
        />
      )}
    </div>
  );
};
export default React.memo(Frame);
