import React, {
  CSSProperties,
  MouseEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";

import { useSelector } from "react-redux";

import { ActionContext, ModalContext } from "../../contexts";
import {
  BlockFn,
  FrameInner,
  ModalPortal,
  FameModal,
  MovingBlockModal,
} from "../index";
import { RootState } from "../../modules";
import {
  Block,
  CommandType,
  ModalType,
  Page,
  SelectionType,
  TemplateFrameCommonProps,
} from "../../types";
import {
  makeNewBlock,
  findPage,
  findBlock,
  findParentBlock,
  isMobile,
  setTemplateItem,
  getEditTime,
} from "../../utils";

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
  const { editPage, editBlock, addBlock } = useContext(ActionContext).actions;
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

  const [command, setCommand] = useState<CommandType>({
    open: false,
    command: null,
    targetBlock: null,
  });

  const [openBlockFnModal, setOpenBlockFnModal] = useState<boolean>(true);
  const [openLoader, setOpenLoader] = useState<boolean>(false);
  const [loaderTargetBlock, setLoaderTargetBlock] = useState<Block | null>(
    null
  );

  const [commandMenuPosition, setCommandMenuPosition] =
    useState<CSSProperties>();
  const [commandMenuStyle, setCommandMenuStyle] = useState<
    CSSProperties | undefined
  >(undefined);
  const [menuOpen, setOpenMenu] = useState<boolean>(false);
  const [selection, setSelection] = useState<SelectionType | null>(null);

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
  // const closeModalMenu = useCallback(
  //   (event: globalThis.MouseEvent) => {
  //     const target = event.target as HTMLElement | null;
  //     if (target) {
  //       const isInModal = target.closest("#modal__menu");
  //       const isInMobileMenu = target.closest("#mobileMenu");
  //       if (!isInModal && !isInMobileMenu) {
  //         setModal({
  //           open: false,
  //           what: null,
  //         });
  //         if (commentBlock && !!document.querySelector(".selected")) {
  //           removeSelected(frameHtml, commentBlock, editBlock, page);
  //         }
  //       }
  //     }
  //   },
  //   [setModal, commentBlock, editBlock, frameHtml, page]
  // );
  //TODO -  삭제
  // const closeMenu = useCallback((event: globalThis.MouseEvent | MouseEvent) => {
  //   const target = event.target as HTMLElement | null;
  //   const isSideMenu = document.getElementById("sideMenu")?.firstElementChild;
  //   const isInrMain = target?.closest("#menu__main");
  //   const isInSide = target?.closest("#sideMenu");

  //   if (isSideMenu) {
  //     isInrMain || isInSide ? setOpenMenu(true) : setOpenMenu(false);
  //   } else {
  //     isInrMain ? setOpenMenu(true) : setOpenMenu(false);
  //   }
  // }, []);
  // /**
  //  * block-comments 창을 닫기 위한 상태 변경
  //  */
  // const changeStateToCloseBlockComments = useCallback(() => {
  //   setCommentBlock(null);
  //   setOpenComment(false);
  // }, [setCommentBlock, setOpenComment]);

  // const closeBlockComments = useCallback(
  //   (event: globalThis.MouseEvent) => {
  //     if (openComment && commentBlock) {
  //       const commentElId = "block-comments";
  //       const commentBtnElId = `${commentBlock.id}__contents`;
  //       const commentsEl = document.getElementById(commentElId);
  //       const commentBtn = document.getElementById(commentBtnElId);
  //       if (commentsEl && commentBtn) {
  //         const target = event.target as HTMLElement | null;
  //         const isInComments = target?.closest(`#${commentElId}`);
  //         const isInCommentsBtn = target?.closest(`#${commentBtnElId}`);
  //         const isInToolMoreBtn = target?.closest(".comment__tool-more");
  //         /**
  //          * block comments 창을 닫는 조건
  //          */
  //         const isInDiscardEditFrom = target?.closest("#discardEditForm");
  //         const condition =
  //           !isInComments &&
  //           !isInCommentsBtn &&
  //           !isInToolMoreBtn &&
  //           !isInDiscardEditFrom;
  //         if (condition) {
  //           changeStateToCloseBlockComments();
  //         }
  //       }
  //     }
  //   },
  //   [commentBlock, openComment, changeStateToCloseBlockComments]
  // );

  const updateBlock = useCallback(() => {
    const item = sessionStorage.getItem(SESSION_KEY.blockToBeEdited);
    if (item) {
      const cursorElement = document.getSelection()?.anchorNode?.parentElement;
      const className = cursorElement?.className;
      const itemObjet = JSON.parse(item);
      const targetBlock: Block = itemObjet.block;
      const pageId = itemObjet.pageId;
      const condition =
        className === "contentEditable" &&
        cursorElement &&
        cursorElement &&
        cursorElement.parentElement?.id === `${targetBlock.id}__contents`;
      if (!condition) {
        editBlock(pageId, targetBlock);
        sessionStorage.removeItem(SESSION_KEY.blockToBeEdited);
      }
    }
  }, [editBlock]);
  // /**
  //  * commandMenuPosition (type:CSSProperties)의 값을 변경하는 함수
  //  */
  // const changeCBSposition = useCallback(() => {
  //   if (command.open && command.targetBlock) {
  //     const frameDomRect = frameHtml?.getClientRects()[0];
  //     const topBarEl = document.querySelector(".topBar");
  //     const blockStyler = document.getElementById("blockStyler");
  //     if (blockStyler) {
  //       //blockStyler
  //       const blockStylerDomRect = blockStyler.getClientRects()[0];
  //       if (frameDomRect) {
  //         //TODO -  수정
  //         const top = blockStylerDomRect.top + blockStylerDomRect.height;
  //         const left = `${blockStylerDomRect.left - frameDomRect.left}px`;
  //         const remainHeight = frameDomRect.height - top;
  //         const toDown = remainHeight > 150;
  //         const bottom =
  //           frameDomRect.height -
  //           blockStylerDomRect.top +
  //           blockStylerDomRect.height +
  //           16;
  //         const maxHeight = toDown
  //           ? remainHeight
  //           : blockStylerDomRect.top - frameDomRect.top - 50;

  //         const style: CSSProperties = toDown
  //           ? {
  //               top: `${top}px`,
  //               left: left,
  //             }
  //           : {
  //               bottom: `${bottom}px`,
  //               left: left,
  //             };
  //         setCommandMenuPosition(style);
  //         const commandMenu_style: CSSProperties = {
  //           maxHeight: `${maxHeight}px`,
  //         };
  //         setCommandMenuStyle(commandMenu_style);
  //       }
  //     } else {
  //       //typing 으로 type 변경 시
  //       const commandInput = document.getElementById("commandInput");
  //       const commandInputDomRect = commandInput?.getClientRects()[0];
  //       if (frameDomRect && commandInputDomRect && topBarEl) {
  //         const top = commandInputDomRect.bottom + frameHtml.scrollTop - 32;
  //         const left = `${commandInputDomRect.left - frameDomRect.left}px`;
  //         const possibleHeight = window.innerHeight - topBarEl.clientHeight;
  //         const remainingHeight = possibleHeight - commandInputDomRect.top - 50;
  //         const toDown = remainingHeight > 150;
  //         const maxHeight = toDown
  //           ? remainingHeight
  //           : commandInputDomRect.top - 50;
  //         const top2 = top - maxHeight - commandInputDomRect.height - 14;

  //         const style: CSSProperties = toDown
  //           ? {
  //               top: `${top}px`,
  //               left: left,
  //             }
  //           : {
  //               top: top2,
  //               left: left,
  //             };
  //         setCommandMenuPosition(style);
  //         const commandMenu_style: CSSProperties = {
  //           maxHeight: `${maxHeight}px`,
  //         };
  //         setCommandMenuStyle(commandMenu_style);
  //       }
  //     }
  //   }
  // }, [command.open, command.targetBlock, frameHtml]);

  /**
   * 모바일 환경에서 Selection 객체 여부를 탐색하고, 유의미한 Selection일 경우 BlockStyler를 열기 위한 작업(mobileMenu 나 BlockComment 창 닫기, selection state 변경, 선택된 내용을 표시할 수 있도록 block content 변경)을 시행함
   */
  const setItemForMobileMenu = useCallback(
    (SELECTION: Selection) => {
      const anchorNode = SELECTION.anchorNode;
      let contentEditableElement: HTMLElement | null | undefined = null;
      switch (anchorNode?.nodeType) {
        case 3:
          //text node
          const parentElement = anchorNode.parentElement;
          contentEditableElement = parentElement?.closest(".contentEditable");

          break;
        case 1:
          //element node
          break;
        default:
          break;
      }
      if (contentEditableElement && contentEditableElement) {
        const blocKContentElement =
          contentEditableElement?.closest(".contents");
        if (blocKContentElement) {
          const blockId = blocKContentElement.id.replace("__contents", "");
          setMobileMenuTargetBlock(findBlock(page, blockId).BLOCK);
        }
      }
    },
    [page]
  );
  // /**
  //  * modal__menu, menu, block-comments 창이 열린 상태에서 이들의 영역 밖을 클릭 시, 열려있는 해당 창들을 다는 기능
  //  */
  // const closePopupMenu = useCallback(
  //   (event: globalThis.MouseEvent) => {
  //     updateBlock();
  //     document.getElementById("menu__main") && //closeMenu(event);
  //       document.getElementById("modal__menu") &&
  //       //closeModalMenu(event);
  //       document.getElementById("block-comments") &&
  //       closeBlockComments(event);
  //     if (command.open) {
  //       const target = event.target as HTMLElement | null;
  //       const commandInputHtml = document.getElementById("commandInput");
  //       if (target && commandInputHtml) {
  //         const isInnerCommand = target.closest("#block__commandMenu");
  //         !isInnerCommand &&
  //           target !== commandInputHtml &&
  //           setCommand({
  //             open: false,
  //             command: null,
  //             targetBlock: null,
  //           });
  //       }
  //     }
  //   },
  //   [closeBlockComments, command.open, updateBlock]
  // );
  //selection
  const isValidatedSelection = (selection: Selection | null) => {
    if (selection) {
      const { anchorNode, focusNode, anchorOffset, focusOffset } = selection;

      const validateSelection =
        !(anchorNode === focusNode && anchorOffset === focusOffset) &&
        anchorNode?.nodeName === "#text" &&
        focusNode?.nodeName === "#text";
      return validateSelection;
    }
  };
  const getBlockFromSelection = (selection: Selection | null) => {
    let block;
    if (selection) {
      const { anchorNode } = selection;
      const blockId = anchorNode?.parentElement
        ?.closest(".block__contents")
        ?.id.replace("__contents", "");
      if (blockId) block = findBlock(page, blockId).BLOCK;
    }

    return block;
  };
  /**
   * 모바일 환경에서 변경된  selection 을 반영하는 기능
   */
  const handleSelectionChange = useCallback(() => {
    const selection = document.getSelection();
    const block = getBlockFromSelection(selection);
    if (block !== modal.block) {
      //클릭이 아닌 마우스 드래그로 다른 블록을 선택할 시 오류  피하기 위해
      closeModal();
    }
    if (isValidatedSelection(selection) && block !== modal.block) {
      setModal({
        open: true,
        target: "blockStyler",
        block: block,
      });
    }

    //TODO -  모바일에서 메뉴 열리는 방식은 블럭 내 포커스가 가면 열리도록 수정
    // if (!notSelect && SELECTION) {
    //   if (openComment) {
    //     setOpenComment(false);
    //     setCommentBlock(null);
    //   }
    //   setItemForMobileMenu(SELECTION);
    // }
  }, [isValidatedSelection, setModal, getBlockFromSelection, modal]);

  // useEffect(() => {
  //   window.addEventListener("resize", changeCBSposition);
  //   return () => window.removeEventListener("resize", changeCBSposition);
  // }, [changeCBSposition]);

  useEffect(() => {
    inner?.addEventListener("keyup", updateBlock);
    inner?.addEventListener("touchstart", updateBlock, { passive: true });
    return () => {
      inner?.removeEventListener("keyup", updateBlock);
      inner?.removeEventListener("touchstart", updateBlock);
    };
  }, [inner, updateBlock]);

  // useEffect(() => {
  //   inner?.addEventListener("click", closePopupMenu);
  //   return () => {
  //     inner?.removeEventListener("click", closePopupMenu);
  //   };
  // }, [inner, closePopupMenu]);

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

  // useEffect(() => {
  //   changeCBSposition();
  // }, [command.open, command.targetBlock, openTemplates, changeCBSposition]);

  // useEffect(() => {
  //   // stop scroll when something open
  //   if (
  //     command.open ||
  //     modal.open ||
  //     openLoader ||
  //     openComment ||
  //     movingTargetBlock ||
  //     selection
  //   ) {
  //     !frameRef.current?.classList.contains("stop") &&
  //       frameRef.current?.classList.add("stop");
  //   } else {
  //     frameRef.current?.classList.contains("stop") &&
  //       frameRef.current?.classList.remove("stop");
  //   }
  // }, [
  //   modal.open,
  //   command.open,
  //   openLoader,
  //   openComment,
  //   movingTargetBlock,
  //   selection,
  // ]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  // useEffect(() => {
  //   if (modal.what === "modalComment") {
  //     const targetCommentInputHtml = document
  //       .getElementById("modalMenu")
  //       ?.querySelector(".commentInput") as HTMLInputElement | null | undefined;
  //     if (targetCommentInputHtml && targetCommentInputHtml) {
  //       targetCommentInputHtml.focus();
  //     }
  //   }
  // }, [modal.what]);

  // useEffect(() => {
  //   if (mobileMenuTargetBlock === null && mobileSideMenu.what && !modal.open) {
  //     const selectedHtml = document.querySelector(".selected");
  //     const contentsHtml = selectedHtml?.closest(".contents");
  //     if (contentsHtml && contentsHtml) {
  //       const blockId = contentsHtml.id.replace("__contents", "");
  //       const targetBlock = findBlock(page, blockId).BLOCK;
  //       removeSelected(frameHtml, targetBlock, editBlock, page);
  //     }
  //   }
  // }, [
  //   mobileMenuTargetBlock,
  //   mobileSideMenu.what,
  //   modal.open,
  //   editBlock,
  //   frameHtml,
  //   page,
  // ]);

  // useEffect(() => {
  //   if (
  //     (openComment && (mobileMenuTargetBlock || mobileSideMenu.what)) ||
  //     movingTargetBlock
  //   ) {
  //     if (mobileMenuTargetBlock) {
  //       setMobileMenuTargetBlock(null);
  //     }
  //     if (document.querySelector("#mobileSideMenu")) {
  //       setMobileSideMenu({
  //         block: null,
  //         what: undefined,
  //       });
  //     }
  //   }
  // }, [
  //   openComment,
  //   mobileMenuTargetBlock,
  //   mobileSideMenu.what,
  //   setMobileSideMenu,
  //   movingTargetBlock,
  // ]);
  const changeOpenBlockFnModal = useCallback(() => {
    setOpenBlockFnModal(!(sideAppear === "lock" && window.innerWidth <= 768));
  }, [setOpenBlockFnModal, sideAppear]);

  useEffect(() => {
    changeOpenBlockFnModal();
    window.addEventListener("resize", changeOpenBlockFnModal);
    return () => {
      window.removeEventListener("resize", changeOpenBlockFnModal);
    };
  }, [changeOpenBlockFnModal]);
  //TODO - 삭제
  useEffect(() => {
    console.log("modal", modal);
  }, [modal]);
  return (
    <div
      className={`frame ${newPageFrame ? "newPageFrame" : ""} ${
        isMobile() ? "mobile" : "web"
      } ${modal.target === "export" ? "export__frame" : ""}`}
      style={frameStyle}
      ref={frameRef}
    >
      <ModalContext.Provider
        value={{ changeModalState: (modal: ModalType) => setModal(modal) }}
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
          showAllComments={props.showAllComments}
          newPageFrame={newPageFrame}
          setMovingTargetBlock={setMovingTargetBlock}
          setMobileMenuTargetBlock={setMobileMenuTargetBlock}
          mobileMenuTargetBlock={mobileMenuTargetBlock}
          frameInnerStyle={frameInnerStyle}
          closeModal={closeModal}
        />
        {/* modal - blockFn */}
        <ModalPortal id="modal-blockFn" isOpen={openBlockFnModal}>
          <BlockFn
            page={page}
            movingTargetBlock={movingTargetBlock}
            setMovingTargetBlock={setMovingTargetBlock}
            modal={modal}
          />
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
      {/* modal - others */}
      {/* 
      <ModalPortal isOpen={modal.open}>


        {modal.target === "mobileMenu" && mobileMenuTargetBlock && (
          <MobileMenu
            pages={pages}
            pagesId={pagesId}
            firstList={firstList}
            userName={userName}
            page={page}
            recentPagesId={recentPagesId}
            modal={modal}
            setModal={setModal}
            setModalStyle={setModalStyle}
            command={command}
            setCommand={setCommand}
            setCommentBlock={setCommentBlock}
            frameHtml={frameHtml}
            mobileMenuTargetBlock={mobileMenuTargetBlock}
            setMobileSideMenu={setMobileSideMenu}
            setMobileMenuTargetBlock={setMobileMenuTargetBlock}
            initialInnerHeight={innerHeight}
          />
        )}
      </ModalPortal> 
      */}
    </div>
  );
};
export default React.memo(Frame);
