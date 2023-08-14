import "../assets/frame.scss";
import React, {
  CSSProperties,
  Dispatch,
  MouseEvent,
  SetStateAction,
  TouchEvent,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import { Block, Page, ListItem } from "../modules/notion/type";

import {
  makeNewBlock,
  findPage,
  findBlock,
  findParentBlock,
  isMobile,
  setTemplateItem,
  removeSelected,
} from "../fn";
import { ActionContext, SelectionType } from "../route/NotionRouter";

import CommandBlock from "./CommandBlock";
import Comments from "./Comments";
import CommentInput from "./CommentInput";
import BlockFn from "./BlockFn";
import Loader from "./Loader";
import PageMenu from "./PageMenu";

import { FontStyleType, mobileSideMenuType } from "../route/NotionRouter";
import BlockStyler from "./BlockStyler";

import MoveTargetBlock from "./MoveTargetBlock";

//icon
import MobileBlockMenu from "./MobileBlockMenu";
import { ModalType } from "../containers/EditorContainer";
import FrameInner from "./FrameInner";
import { useSelector } from "react-redux";
import { RootState } from "../modules";
export type Command = {
  open: boolean;
  command: string | null;
  targetBlock: Block | null;
};
export type Template_Frame_SAME_Props = {
  userName: string;
  pages: Page[];
  pagesId: string[];
  firstList: ListItem[];
  recentPagesId: string[] | null;
  commentBlock: Block | null;
  openComment: boolean;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  openTemplates: boolean;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
  modal: ModalType;
  setModal: Dispatch<SetStateAction<ModalType>>;
  setCommentBlock: Dispatch<SetStateAction<Block | null>>;
  showAllComments: boolean;
  smallText: boolean;
  fullWidth: boolean;
  discardEdit: boolean;
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
  fontStyle: FontStyleType;
  mobileSideMenu: mobileSideMenuType;
  setMobileSideMenu: Dispatch<SetStateAction<mobileSideMenuType>>;
};
export type FrameProps = Template_Frame_SAME_Props & {
  page: Page;
};
/**
 * mouse drag로 위치를 변경시킬 블록의 내용을 보여주는 component
 * @param param0
 * @returns
 */

const Frame = ({
  userName,
  page,
  pagesId,
  pages,
  firstList,
  recentPagesId,
  commentBlock,
  openComment,
  setOpenComment,
  setCommentBlock,
  modal,
  setModal,
  showAllComments,
  smallText,
  fullWidth,
  discardEdit,
  setDiscardEdit,
  openTemplates,
  setOpenTemplates,
  fontStyle,
  mobileSideMenu,
  setMobileSideMenu,
}: FrameProps) => {
  const sideAppear = useSelector((state: RootState) => state.side.appear);
  const { editPage, editBlock, addBlock } = useContext(ActionContext).actions;
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;
  const inner = document.getElementById("inner");
  const frameRef = useRef<HTMLDivElement>(null);
  const frameHtml = frameRef.current;
  const [templateHtml, setTemplateHtml] = useState<HTMLElement | null>(null);
  const firstBlocksId = page.firstBlocksId;
  const firstBlocks = firstBlocksId
    ? firstBlocksId.map((id: string) => findBlock(page, id).BLOCK)
    : null;
  const newPageFrame: boolean = page.firstBlocksId === null;

  const [command, setCommand] = useState<Command>({
    open: false,
    command: null,
    targetBlock: null,
  });

  const [openLoader, setOpenLoader] = useState<boolean>(false);
  const [loaderTargetBlock, setLoaderTargetBlock] = useState<Block | null>(
    null
  );

  const [commandBlockPosition, setCBPosition] = useState<CSSProperties>();
  const [commandBlockStyle, setCommandBlockStyle] = useState<
    CSSProperties | undefined
  >(undefined);
  const [menuOpen, setOpenMenu] = useState<boolean>(false);
  const [selection, setSelection] = useState<SelectionType | null>(null);
  const [modalStyle, setModalStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  /**
   * page 내의 위치를 변경하는 대상이 되는  block
   */
  const [moveTargetBlock, setMoveTargetBlock] = useState<Block | null>(null);
  /**
   * page내의 블록의 위치 변경이 있는 지 여부를 나타냄
   */
  const isMoved = useRef<boolean>(false);
  /** block 이동 시, 이동 할 위치의 기준이 되는 block(block 은 pointBlockToMoveBlock.current의 앞에 위치하게됨) */
  const pointBlockToMoveBlock = useRef<Block | null>(null);
  const [mobileMenuTargetBlock, setMobileMenuTargetBlock] =
    useState<Block | null>(null);
  const scrollbarWidth = 10;
  const sideBarEl = document.querySelector(".sideBar");
  const sideBarWidth =
    sideAppear === "lock" && sideBarEl ? sideBarEl.clientWidth : 0;
  const maxWidth = innerWidth - sideBarWidth - scrollbarWidth;
  const fontSize: number = isMobile()
    ? openTemplates
      ? 1.5
      : smallText
      ? 1
      : 1.2
    : openTemplates
    ? 1.25
    : smallText
    ? 0.8
    : 1;
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
  const closeModalMenu = useCallback(
    (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target) {
        const isInModal = target.closest("#modal__menu");
        const isInMobileBlockMenu = target.closest("#mobileBlockMenu");
        if (!isInModal && !isInMobileBlockMenu) {
          setModal({
            open: false,
            what: null,
          });
        }
      }
    },
    [setModal]
  );

  const closeMenu = useCallback((event: globalThis.MouseEvent | MouseEvent) => {
    const target = event.target as HTMLElement | null;
    const isSideMenu = document.getElementById("sideMenu")?.firstElementChild;
    const isInrMain = target?.closest("#menu__main");
    const isInSide = target?.closest("#sideMenu");

    if (isSideMenu) {
      isInrMain || isInSide ? setOpenMenu(true) : setOpenMenu(false);
    } else {
      isInrMain ? setOpenMenu(true) : setOpenMenu(false);
    }
  }, []);
  const closeComments = useCallback(
    (event: globalThis.MouseEvent) => {
      if (openComment && commentBlock) {
        const commentElId = "block-comments";
        const commentBtnElId = `${commentBlock.id}__contents`;
        const commentsEl = document.getElementById(commentElId);
        const commentBtn = document.getElementById(commentBtnElId);
        if (commentsEl && commentBtn) {
          const target = event.target as HTMLElement | null;
          const isInComments = target?.closest(`#${commentElId}`);
          const isInCommentsBtn = target?.closest(`#${commentBtnElId}`);
          const isInToolMoreBtn = target?.closest("#tool-more");
          /**
           * block comments 창을 닫는 조건
           */
          const isInDiscardEditFrom = target?.closest("#discardEditForm");
          const condition =
            !isInComments &&
            !isInCommentsBtn &&
            !isInToolMoreBtn &&
            !isInDiscardEditFrom;
          if (condition) {
            setCommentBlock(null);
            setOpenComment(false);
          }
        }
      }
    },
    [commentBlock, openComment, setCommentBlock, setOpenComment]
  );

  /**
   * [isMoved]
   */
  const makeMoveBlockTrue = useCallback(() => {
    if (moveTargetBlock) {
      isMoved.current = true;
    }
  }, [moveTargetBlock]);
  /**
   * [isMoved]  블록의 위치를 변경하고, 변경된 위치에 따라 page의 data도 변경하는 함수
   */
  const changeBlockPosition = useCallback(() => {
    if (
      pointBlockToMoveBlock.current &&
      moveTargetBlock &&
      page.blocksId &&
      page.blocks &&
      page.firstBlocksId
    ) {
      const FIRST_BLOCKS_ID = [...page.firstBlocksId];
      setTemplateItem(templateHtml, page);
      //edit block
      const editTime = JSON.stringify(Date.now());
      const blocksId = [...page.blocksId];
      const blocks = [...page.blocks];
      const pointBlock = pointBlockToMoveBlock.current;
      const targetBlockIsList =
        moveTargetBlock.type === "numberList" ||
        moveTargetBlock.type === "bulletList";
      const newBlock = makeNewBlock(page, null, "");
      const newParentBlockOfList: Block = {
        ...newBlock,
        firstBlock: pointBlock.firstBlock,
        type:
          moveTargetBlock.type === "numberList"
            ? "numberListArr"
            : "bulletListArr",
        subBlocksId: [moveTargetBlock.id],
        parentBlocksId: pointBlock.parentBlocksId,
      };
      /**
       * 이동의 타켓이 되는 block으로 이동으로 인해 변경한 data를 가짐
       */
      const targetBlock: Block = targetBlockIsList
        ? {
            ...moveTargetBlock,
            firstBlock: false,
            parentBlocksId: newParentBlockOfList.parentBlocksId
              ? newParentBlockOfList.parentBlocksId.concat(
                  newParentBlockOfList.id
                )
              : [newParentBlockOfList.id],
            editTime: editTime,
          }
        : {
            ...moveTargetBlock,
            firstBlock: pointBlock.firstBlock,
            parentBlocksId: pointBlock.parentBlocksId,
            editTime: editTime,
          };

      /**
       * targetBlock의 subBlock가 존재할 경우, subBlock들의 parentBlocksId에서 특정 id를 제거하거나 다른 id로 변경하는 함수
       * @param targetBlock parentBlocksId를 변경할 subBlock 들의 parentBlock
       * @param parentBlockId subBlocks 들의 parentBlocksId에서 제거해야할 id
       * @param newParentBlockId  subBlocks 들의 parentBlocksId에서 parentBlockId(parameter)와 변경되어야할 새로운 parentBlockId
       */
      const deleteParentBlocksIdFromSubBlock = (
        targetBlock: Block,
        parentBlockId: string,
        newParentBlockId: string | null
      ) => {
        if (targetBlock.subBlocksId) {
          targetBlock.subBlocksId.forEach((id: string) => {
            const subBlocksIndex = blocksId.indexOf(id);
            const subBlock = blocks[subBlocksIndex];
            const parentBlocksId = [...(subBlock.parentBlocksId as string[])];
            const parentBlockIndex = parentBlocksId.indexOf(parentBlockId);
            if (targetBlockIsList && newParentBlockId) {
              parentBlocksId.splice(parentBlockIndex, 1, newParentBlockId);
            } else {
              parentBlocksId.splice(parentBlockIndex, 1);
            }
            const editedSubBlock: Block = {
              ...subBlock,
              parentBlocksId: parentBlockId[0] ? parentBlocksId : null,
              editTime: editTime,
            };
            editBlock(page.id, editedSubBlock);
            subBlock.subBlocksId &&
              deleteParentBlocksIdFromSubBlock(
                subBlock,
                parentBlockId,
                newParentBlockId
              );
          });
        }
      };

      if (pointBlock.firstBlock) {
        const pointBlock_firstBlockIndex = FIRST_BLOCKS_ID?.indexOf(
          pointBlock.id
        ) as number;
        if (targetBlock.firstBlock) {
          const firstBlockIndex = FIRST_BLOCKS_ID.indexOf(targetBlock.id);
          FIRST_BLOCKS_ID.splice(firstBlockIndex, 1);
          FIRST_BLOCKS_ID.splice(pointBlock_firstBlockIndex, 0, targetBlock.id);
        } else {
          //edit targetBlock's  origin parentBlock
          const { parentBlock } = findParentBlock(page, moveTargetBlock);
          if (parentBlock.subBlocksId) {
            const editedParentBlock: Block = {
              ...parentBlock,
              subBlocksId: parentBlock.subBlocksId.filter(
                (id: string) => id !== targetBlock.id
              ),
              editTime: editTime,
            };
            editBlock(page.id, editedParentBlock);
          }
          // edit targetBlock.subBlocksId
          if (targetBlock.subBlocksId) {
            deleteParentBlocksIdFromSubBlock(
              targetBlock,
              parentBlock.id,
              targetBlockIsList ? newParentBlockOfList.id : null
            );
          }
          //add first Blocks
          if (targetBlockIsList) {
            const preBlockId = FIRST_BLOCKS_ID[pointBlock_firstBlockIndex - 1];
            const preBlockIndexInBlocksId = page.blocksId.indexOf(preBlockId);
            addBlock(
              page.id,
              newParentBlockOfList,
              preBlockIndexInBlocksId + 1,
              preBlockId
            );
            FIRST_BLOCKS_ID.splice(
              pointBlock_firstBlockIndex,
              0,
              newParentBlockOfList.id
            );
          } else {
            FIRST_BLOCKS_ID.splice(
              pointBlock_firstBlockIndex,
              0,
              targetBlock.id
            );
          }

          editBlock(page.id, targetBlock);
        }
      }
      //case2. pointBlock is subBlock : pointBlock의 parentBlock의 subBlock 으로 이동
      if (!pointBlock.firstBlock) {
        const parentBlockOfPointBlock = findParentBlock(
          page,
          pointBlock
        ).parentBlock;
        //STEP1. targetBlock이 firstBlock일 경우 page의 firstBlocksId에서 삭제, 아닐 경우 targetBlock의 parentBlock을 수정
        if (targetBlock.firstBlock) {
          const firstBlocksIdIndex = FIRST_BLOCKS_ID.indexOf(targetBlock.id);
          FIRST_BLOCKS_ID.splice(firstBlocksIdIndex, 1);
        } else {
          /**
           * moveTargetBlock의 parentBlock 으로 , targetBlock은 블록의 이동에 따라  moveTargetBlock에서 data를 변경한 것이기 때문에 targetBlock의 parent가 아닌 moveTargetBlock의 parent여야함
           */
          const moveTargetBlockParent: Block = findParentBlock(
            page,
            moveTargetBlock
          ).parentBlock;
          if (moveTargetBlockParent.id !== parentBlockOfPointBlock.id) {
            const subBlocksId = moveTargetBlockParent.subBlocksId;
            if (subBlocksId) {
              const subBlockIndex = subBlocksId.indexOf(targetBlock.id);
              subBlocksId.splice(subBlockIndex, 1);
              const newTargetBlockParent: Block = {
                ...moveTargetBlockParent,
                subBlocksId: subBlocksId,
                editTime: editTime,
              };
              editBlock(page.id, newTargetBlockParent);
            }
          } else {
            // step2-2에서 실행
          }
        }

        //STEP2. edit parentBlock of pointBlock : 위치 변경에 따라 targetBlock or newParentBlockOfTargetBlock을 parentBlockOfPoint 의 subBlocksId 에 추가 , targetBlockIsList 일 경우 , newParentBlockOfTargetBlock을 페이지에 생성

        // step2-1 : targetBlockIsList 일때, newParentBlockOfTargetBlock을 페이지에 추가
        if (targetBlockIsList && parentBlockOfPointBlock.subBlocksId) {
          const pointBlockIndex = blocksId.indexOf(pointBlock.id);
          const pointBlockIndexAsSub =
            parentBlockOfPointBlock.subBlocksId.indexOf(pointBlock.id);
          if (pointBlockIndexAsSub === 0) {
            addBlock(page.id, newParentBlockOfList, pointBlockIndex - 1, null);
          } else {
            const previousBlockId =
              parentBlockOfPointBlock.subBlocksId[pointBlockIndexAsSub - 1];
            addBlock(
              page.id,
              newParentBlockOfList,
              pointBlockIndex - 1,
              previousBlockId
            );
          }
        }
        //step2-2 : targetBlock을 subBlocksId에 추가
        if (!targetBlockIsList && parentBlockOfPointBlock.subBlocksId) {
          const parentBlockSubBlocksId = [
            ...parentBlockOfPointBlock.subBlocksId,
          ];
          if (parentBlockSubBlocksId.includes(targetBlock.id)) {
            // 이미 targetBlock 이 parentBlockOfPointBlock 에 있는 경우, parentBlock에서 targetBlock을 삭제
            const targetBlockSubIndex = parentBlockSubBlocksId.indexOf(
              targetBlock.id
            );
            parentBlockSubBlocksId.splice(targetBlockSubIndex, 1);
          }
          const subBlockIndex = parentBlockSubBlocksId.indexOf(pointBlock.id);
          parentBlockSubBlocksId.splice(subBlockIndex, 0, targetBlock.id);
          const newParentBlock: Block = {
            ...parentBlockOfPointBlock,
            subBlocksId: parentBlockSubBlocksId,
            editTime: editTime,
          };
          editBlock(page.id, newParentBlock);
        }
        //STEP3.targetBlock의 subBlocks의 parentBlocksId 수정
        const addParentBlockToSubBlock = (targetBlock: Block) => {
          if (targetBlock.subBlocksId) {
            targetBlock.subBlocksId.forEach((id: string) => {
              const subBlockIndex = blocksId.indexOf(id);
              const subBlock = blocks[subBlockIndex];
              if (targetBlock.parentBlocksId) {
                const newSubBlock: Block = {
                  ...subBlock,
                  parentBlocksId: subBlock.parentBlocksId
                    ? targetBlock.parentBlocksId.concat(targetBlock.id)
                    : null,
                };
                editBlock(page.id, newSubBlock);
              }
              subBlock.subBlocksId && addParentBlockToSubBlock(subBlock);
            });
          }
        };

        if (targetBlock.subBlocksId && targetBlock.parentBlocksId) {
          if (moveTargetBlock.parentBlocksId) {
            moveTargetBlock.parentBlocksId[
              moveTargetBlock.parentBlocksId.length - 1
            ] !==
              targetBlock.parentBlocksId[
                targetBlock.parentBlocksId.length - 1
              ] && addParentBlockToSubBlock(targetBlock);
          } else {
            addParentBlockToSubBlock(targetBlock);
          }
        }
        //STEP4. targetBlock 수정
        editBlock(page.id, targetBlock);
      }
      const editedPage = findPage(pagesId, pages, page.id);
      const newPage: Page = {
        ...editedPage,
        firstBlocksId: FIRST_BLOCKS_ID,
      };
      setTemplateItem(templateHtml, page);
      editPage(page.id, newPage);
    }
  }, [
    addBlock,
    editBlock,
    editPage,
    moveTargetBlock,
    page,
    pages,
    pagesId,
    templateHtml,
  ]);
  /**
   * [isMoved] block의 위치를 변경 시키는 것이 끝났을 때 (mouseUp | touchEnd) , 사용자가 지정한 위치대로 state를 변경하고 블록의 위치 변동을 위해 설정한 모든 것을 원래대로 되돌리는 함수
   */
  const stopMovingBlock = useCallback(() => {
    if (isMoved.current) {
      changeBlockPosition();
      isMoved.current = false;
      setMoveTargetBlock(null);
      pointBlockToMoveBlock.current = null;
      const mainBlockOn = document.querySelector(".mainBlock.on");
      mainBlockOn?.classList.remove("on");
      const editableBlockOn = document.querySelector(".editableBlock.on");
      editableBlockOn?.classList.remove("on");
    }
  }, [changeBlockPosition]);
  /**
   * [isMoved] 마우스, 터치의 이동에 따라 moveTargetBlock을 이동시키는 함수
   * @param clientX mouseEvent.clientX | touchEvent.touches[0].clientX
   * @param clientY mouseEvent.clientY | touchEvent.touches[0].clientY
   */
  const move_MoveTargetBlock = useCallback(
    (clientX: number, clientY: number) => {
      if (moveTargetBlock && isMoved.current) {
        const editor = document.querySelector(".editor");
        const moveTargetBlockHtml = document.getElementById("moveTargetBlock");
        if (moveTargetBlockHtml && editor) {
          moveTargetBlockHtml.setAttribute(
            "style",
            `position:absolute; top:${clientY + editor.scrollTop + 5}px; left:${
              clientX + 5
            }px`
          );
        }
      }
    },
    [moveTargetBlock]
  );
  /**
   * [isMoved - mobile] 모바일 브라우저에서, moveTargetBlock의 위치를 변경시키고 moveTargetBlock의 위치에 있는 element인지 여부에 따라 클래스를 변경하고, pointBlockToMoveBlock.current 의 value를 바꾸는 함수
   * @param event
   */
  const move_MoveTargetBlockInMobile = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (isMoved.current) {
        const clientX = event.touches[0].clientX;
        const clientY = event.touches[0].clientY;
        frameHtml?.scrollTo(0, clientY);
        document.querySelectorAll(".mainBlock").forEach((element) => {
          const domRect = element.getClientRects()[0];
          const isPointBlock =
            domRect.top <= clientY && domRect.bottom >= clientY;
          if (isPointBlock) {
            element.classList.add("on");
            const blockId = element.closest(".block")?.id.replace("block-", "");
            if (blockId) {
              pointBlockToMoveBlock.current = findBlock(page, blockId).BLOCK;
            }
          } else {
            element.classList.contains("on") && element.classList.remove("on");
          }
        });
        move_MoveTargetBlock(clientX, clientY);
      }
    },
    [frameHtml, move_MoveTargetBlock, page]
  );

  // edit block using sessionStorage
  const updateBlock = useCallback(() => {
    const item = sessionStorage.getItem("itemsTobeEdited");
    if (item) {
      const cursorElement = document.getSelection()?.anchorNode?.parentElement;
      const className = cursorElement?.className;
      const itemObjet = JSON.parse(item);
      const targetBlock = itemObjet.block;
      const pageId = itemObjet.pageId;
      const condition =
        className === "contentEditable" &&
        cursorElement &&
        cursorElement &&
        cursorElement.parentElement?.id === `${targetBlock.id}__contents`;
      if (!condition) {
        editBlock(pageId, targetBlock);
        sessionStorage.removeItem("itemsTobeEdited");
      }
    }
  }, [editBlock]);
  /**
   * commandBlockPosition (type:CSSProperties)의 값을 변경하는 함수
   */
  const changeCBSposition = useCallback(() => {
    if (command.open && command.targetBlock) {
      const frameDomRect = frameHtml?.getClientRects()[0];
      const blockStyler = document.getElementById("blockStyler");
      if (blockStyler) {
        //blockStyler
        const blockStylerDomRect = blockStyler.getClientRects()[0];
        if (frameDomRect) {
          const top = blockStylerDomRect.top + blockStylerDomRect.height;
          const left = `${blockStylerDomRect.left - frameDomRect.left}px`;
          const remainHeight = frameDomRect.height - top;
          const toDown = remainHeight > 150;
          const bottom =
            frameDomRect.height -
            blockStylerDomRect.top +
            blockStylerDomRect.height +
            16;
          const maxHeight = toDown
            ? remainHeight
            : blockStylerDomRect.top - frameDomRect.top - 50;
          const style: CSSProperties = toDown
            ? {
                top: `${top}px`,
                left: left,
              }
            : {
                bottom: `${bottom}px`,
                left: left,
              };
          setCBPosition(style);
          const commandBlock_style: CSSProperties = {
            maxHeight: `${maxHeight}px`,
          };
          setCommandBlockStyle(commandBlock_style);
        }
      } else {
        //typing 으로 type 변경 시
        const commandInput = document.getElementById("commandInput");
        const commandInputDomRect = commandInput?.getClientRects()[0];
        if (frameDomRect && commandInputDomRect) {
          const top = commandInputDomRect.top + commandInputDomRect.height + 14;
          const left = `${commandInputDomRect.left - frameDomRect.left}px`;
          const remainingHeight = frameDomRect.height - top;
          const toDown = remainingHeight > 150;
          const bottom =
            frameDomRect.height -
            commandInputDomRect.top +
            commandInputDomRect.height;
          const maxHeight = toDown
            ? remainingHeight
            : frameDomRect.top - bottom - 50;
          const style: CSSProperties = toDown
            ? {
                top: `${top}px`,
                left: left,
              }
            : {
                bottom: `${bottom}px`,
                left: left,
              };
          setCBPosition(style);
          const commandBlock_style: CSSProperties = {
            maxHeight: `${maxHeight}px`,
          };
          setCommandBlockStyle(commandBlock_style);
        }
      }
    }
  }, [command.open, command.targetBlock, frameHtml]);

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
  /**
   * modal__menu, menu, block-comments 창이 열린 상태에서 이들의 영역 밖을 클릭 시, 열려있는 해당 창들을 다는 기능
   */
  const closePopupMenu = useCallback(
    (event: globalThis.MouseEvent) => {
      updateBlock();
      document.getElementById("menu__main") && closeMenu(event);
      document.getElementById("modal__menu") && closeModalMenu(event);
      document.getElementById("block-comments") && closeComments(event);
      if (command.open) {
        const target = event.target as HTMLElement | null;
        const commandInputHtml = document.getElementById("commandInput");
        if (target && commandInputHtml) {
          const isInnerCommand = target.closest("#block__commandBlock");
          !isInnerCommand &&
            target !== commandInputHtml &&
            setCommand({
              open: false,
              command: null,
              targetBlock: null,
            });
        }
      }
    },
    [closeComments, closeMenu, closeModalMenu, command.open, updateBlock]
  );
  /**
   * 모바일 환경에서 변경된  selection 을 반영하는 기능
   */
  const handleSelectionChange = useCallback(() => {
    if (isMobile() && openComment) {
      const SELECTION = document.getSelection();
      const notSelect =
        SELECTION?.anchorNode === SELECTION?.focusNode &&
        SELECTION?.anchorOffset === SELECTION?.focusOffset;
      if (!notSelect && SELECTION) {
        if (openComment) {
          setOpenComment(false);
          setCommentBlock(null);
        }
        setItemForMobileMenu(SELECTION);
      }
    }
  }, [openComment, setCommentBlock, setItemForMobileMenu, setOpenComment]);
  useEffect(() => {
    window.addEventListener("resize", changeCBSposition);
    return () => window.removeEventListener("resize", changeCBSposition);
  }, [changeCBSposition]);

  useEffect(() => {
    inner?.addEventListener("keyup", updateBlock);
    inner?.addEventListener("touchstart", updateBlock, { passive: true });
    return () => {
      inner?.removeEventListener("keyup", updateBlock);
      inner?.removeEventListener("touchstart", updateBlock);
    };
  }, [inner, updateBlock]);

  useEffect(() => {
    inner?.addEventListener("click", closePopupMenu);
    return () => {
      inner?.removeEventListener("click", closePopupMenu);
    };
  }, [inner, closePopupMenu]);

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
    changeCBSposition();
  }, [command.open, command.targetBlock, openTemplates, changeCBSposition]);

  useEffect(() => {
    // stop scroll when something open
    if (
      modal.open ||
      command.command ||
      openLoader ||
      openComment ||
      moveTargetBlock ||
      selection
    ) {
      !frameRef.current?.classList.contains("stop") &&
        frameRef.current?.classList.add("stop");
    } else {
      frameRef.current?.classList.contains("stop") &&
        frameRef.current?.classList.remove("stop");
    }
  }, [
    modal.open,
    command.command,
    openLoader,
    openComment,
    moveTargetBlock,
    selection,
  ]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  useEffect(() => {
    if (modal.what === "modalComment") {
      const targetCommentInputHtml = document
        .getElementById("modalMenu")
        ?.querySelector(".commentInput") as HTMLInputElement | null | undefined;
      if (targetCommentInputHtml && targetCommentInputHtml) {
        targetCommentInputHtml.focus();
      }
    }
  }, [modal.what]);
  useEffect(() => {
    if (mobileMenuTargetBlock === null && mobileSideMenu.what && !modal.open) {
      const selectedHtml = document.querySelector(".selected");
      const contentsHtml = selectedHtml?.closest(".contents");
      if (contentsHtml && contentsHtml) {
        const blockId = contentsHtml.id.replace("__contents", "");
        const targetBlock = findBlock(page, blockId).BLOCK;
        removeSelected(frameHtml, targetBlock, editBlock, page, null);
      }
    }
  }, [
    mobileMenuTargetBlock,
    mobileSideMenu.what,
    modal.open,
    editBlock,
    frameHtml,
    page,
  ]);

  useEffect(() => {
    if (openComment && (mobileMenuTargetBlock || mobileSideMenu.what)) {
      if (mobileMenuTargetBlock) {
        setMobileMenuTargetBlock(null);
      }
      if (document.querySelector("#mobileSideMenu")) {
        setMobileSideMenu({
          block: null,
          what: undefined,
        });
      }
    }
  }, [
    openComment,
    mobileMenuTargetBlock,
    mobileSideMenu.what,
    setMobileSideMenu,
  ]);
  return (
    <div
      className={`frame ${newPageFrame ? "newPageFrame" : ""} ${
        isMobile() ? "mobile" : "web"
      }`}
      style={frameStyle}
      ref={frameRef}
      // style={{
      //   overflowY:
      //     mobileMenuTargetBlock || (isMobile() && modal.open)
      //       ? "hidden"
      //       : "scroll",
      // }}
      onMouseMove={(event) =>
        move_MoveTargetBlock(event.clientX, event.clientY)
      }
      onMouseUp={stopMovingBlock}
      onTouchMove={(event) => move_MoveTargetBlockInMobile(event)}
      onTouchEnd={stopMovingBlock}
    >
      <FrameInner
        userName={userName}
        pages={pages}
        pagesId={pagesId}
        firstBlocks={firstBlocks}
        page={page}
        frameRef={frameRef}
        fontSize={fontSize}
        openTemplates={openTemplates}
        templateHtml={templateHtml}
        discardEdit={discardEdit}
        setDiscardEdit={setDiscardEdit}
        showAllComments={showAllComments}
        newPageFrame={newPageFrame}
        pointBlockToMoveBlock={pointBlockToMoveBlock}
        makeMoveBlockTrue={makeMoveBlockTrue}
        isMoved={isMoved}
        setMoveTargetBlock={setMobileMenuTargetBlock}
        command={command}
        setCommand={setCommand}
        openComment={openComment}
        setOpenComment={setOpenComment}
        setCommentBlock={setCommentBlock}
        setOpenLoader={setOpenLoader}
        setLoaderTargetBlock={setLoaderTargetBlock}
        closeMenu={closeMenu}
        setSelection={setSelection}
        setMobileMenuTargetBlock={setMobileMenuTargetBlock}
        mobileMenuTargetBlock={mobileMenuTargetBlock}
        setOpenTemplates={setOpenTemplates}
        frameInnerStyle={frameInnerStyle}
      />
      {command.open && command.targetBlock && (
        <div id="block__commandBlock" style={commandBlockPosition}>
          <CommandBlock
            style={commandBlockStyle}
            key={`${command.targetBlock.id}_command`}
            page={page}
            block={command.targetBlock}
            command={command}
            setCommand={setCommand}
            setSelection={setSelection}
          />
        </div>
      )}
      {openLoader && loaderTargetBlock && (
        <Loader
          block={loaderTargetBlock}
          page={page}
          editBlock={editBlock}
          editPage={null}
          frameHtml={frameHtml}
          setOpenLoader={setOpenLoader}
          setLoaderTargetBlock={setLoaderTargetBlock}
        />
      )}
      {!isMobile() && (
        <BlockFn
          page={page}
          pages={pages}
          pagesId={pagesId}
          firstList={firstList}
          userName={userName}
          frameHtml={frameHtml}
          commentBlock={commentBlock}
          setCommentBlock={setCommentBlock}
          moveTargetBlock={moveTargetBlock}
          setMoveTargetBlock={setMoveTargetBlock}
          modal={modal}
          setModal={setModal}
          menuOpen={menuOpen}
          setOpenMenu={setOpenMenu}
          setModalStyle={setModalStyle}
        />
      )}

      {modal.open && (
        <div id="modal__menu" className="modal" style={modalStyle}>
          {modal.what === "modalMoveToPage" && (
            <PageMenu
              what="block"
              currentPage={page}
              pages={pages}
              firstList={firstList}
              closeMenu={() => setModal({ open: false, what: null })}
            />
          )}
          {modal.what === "modalComment" && commentBlock && (
            <CommentInput
              pageId={page.id}
              page={page}
              userName={userName}
              editBlock={editBlock}
              editPage={editPage}
              mainComment={null}
              subComment={null}
              commentBlock={commentBlock}
              allComments={commentBlock.comments}
              setAllComments={null}
              setModal={setModal}
              addOrEdit="add"
              setEdit={null}
              templateHtml={templateHtml}
              frameHtml={frameHtml}
            />
          )}
        </div>
      )}
      {commentBlock && openComment && (
        <Comments
          userName={userName}
          block={commentBlock}
          pageId={page.id}
          page={page}
          frameHtml={frameHtml}
          openComment={openComment}
          select={null}
          discardEdit={discardEdit}
          setDiscardEdit={setDiscardEdit}
          showAllComments={showAllComments}
        />
      )}
      {moveTargetBlock && (
        <MoveTargetBlock
          key={moveTargetBlock.id}
          pages={pages}
          pagesId={pagesId}
          page={page}
          block={moveTargetBlock}
          fontSize={fontSize}
          isMoved={isMoved}
          setMoveTargetBlock={setMoveTargetBlock}
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
      {selection && (
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
      {mobileMenuTargetBlock && (
        <MobileBlockMenu
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
    </div>
  );
};
export default React.memo(Frame);
