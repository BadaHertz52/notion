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
import {
  Block,
  ListItem,
  ModalType,
  Page,
  TemplateFrameCommonProps,
} from "../../types";
import { findBlock, isMobile, isTemplates } from "../../utils";

import "../../assets/frame.scss";
import { INITIAL_MODAL, SESSION_KEY } from "../../constants";

export type FrameProps = TemplateFrameCommonProps & {
  firstList: ListItem[];
  pages: Page[];
  pagesId: string[];
  page: Page;
  isExport?: boolean;
  isOpenTemplate: boolean;
  openTemplates?: () => void;
};
/**
 * mouse drag로 위치를 변경시킬 블록의 내용을 보여주는 component
 * @param param0
 * @returns
 */

const Frame = ({ ...props }: FrameProps) => {
  const { page, fontStyle, smallText, fullWidth, isOpenTemplate } = props;
  const sideAppear = useSelector((state: RootState) => state.side.appear);
  const { editPage, editBlock } = useContext(ActionContext).actions;
  const innerWidth = window.innerWidth;

  const inner = document.getElementById("notion__inner");
  const frameRef = useRef<HTMLDivElement>(null);
  const frameHtml = frameRef.current;
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
  const hideQuickMenu = isOpenTemplate ? page.type !== "template" : false;
  const scrollbarWidth = 10;
  const sideBarEl = document.querySelector(".sideBar");
  const sideBarWidth =
    sideAppear === "lock" && sideBarEl ? sideBarEl.clientWidth : 0;
  const maxWidth = innerWidth - sideBarWidth - scrollbarWidth - 90;
  const fontSize: number = isTemplates() ? 1.25 : smallText ? 0.8 : 1;
  const frameStyle: CSSProperties = {
    fontFamily: fontStyle,
    fontSize: `${fontSize}rem`,
  };
  const frameInnerStyle: CSSProperties = {
    width: isMobile()
      ? "90%"
      : isTemplates()
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
    document.addEventListener("keyup", updateBlock);
    document.addEventListener("touchstart", updateBlock, { passive: true });
    return () => {
      document.removeEventListener("keyup", updateBlock);
      document.removeEventListener("touchstart", updateBlock);
    };
  }, [inner, updateBlock]);

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
      } ${props.isExport ? "export__frame" : ""}`}
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
          {...props}
          firstBlocks={firstBlocks}
          page={page}
          frameRef={frameRef}
          fontSize={fontSize}
          newPageFrame={newPageFrame}
          setMovingTargetBlock={setMovingTargetBlock}
          frameInnerStyle={frameInnerStyle}
          closeModal={closeModal}
        />
        {!hideQuickMenu && (
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
        )}
        {modal.open && (
          <FameModal
            {...props}
            page={page}
            frameHtml={frameHtml}
            fontSize={fontSize}
            modal={modal}
            setModal={setModal}
            closeModal={closeModal}
            editBlock={editBlock}
            editPage={editPage}
          />
        )}
      </ModalContext.Provider>
      {movingTargetBlock && (
        <MovingBlockModal
          isOpen={!!movingTargetBlock}
          pages={props.pages}
          pagesId={props.pagesId}
          page={page}
          block={movingTargetBlock}
          fontSize={fontSize}
          closeModal={() => setMovingTargetBlock(null)}
        />
      )}
    </div>
  );
};
export default React.memo(Frame);
