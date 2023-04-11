import "../assets/frame.css";
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
} from "react";
import {
  Block,
  MainCommentType,
  blockSample,
  findBlock,
  findParentBlock,
  listItem,
  Page,
  makeNewBlock,
  findPage,
} from "../modules/notion";
import { ActionContext, selectionType } from "../containers/NotionRouter";
import EditableBlock from "./EditableBlock";
import IconModal, { randomIcon } from "./IconModal";
import CommandBlock from "./CommandBlock";
import Comments, { CommentInput } from "./Comments";
import BlockFn, { detectRange } from "./BlockFn";
import Loader from "./Loader";
import PageIcon from "./PageIcon";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import PageMenu from "./PageMenu";
import { isMobile, setTemplateItem } from "./BlockComponent";
import { fontStyleType, mobileSideMenuType } from "../containers/NotionRouter";
import BlockStyler, { removeSelected } from "./BlockStyler";
import MoveTargetBlock from "./MoveTargetBlock";

//icon
import { BiMessageDetail } from "react-icons/bi";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { GrDocumentText, GrDocument } from "react-icons/gr";
import { MdInsertPhoto } from "react-icons/md";
import { HiTemplate } from "react-icons/hi";
import MobileBlockMenu from "./MobileBlockMenu";
import { ModalType } from "../containers/EditorContainer";
export type Command = {
  boolean: boolean;
  command: string | null;
  targetBlock: Block | null;
};
export type Template_Frame_SAME_Props = {
  userName: string;
  pages: Page[];
  pagesId: string[];
  firstList: listItem[];
  recentPagesId: string[] | null;
  setTargetPageId: Dispatch<React.SetStateAction<string>>;
  setRoutePage: Dispatch<React.SetStateAction<Page | null>>;
  commentBlock: Block | null;
  openComment: boolean;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  openTemplates: boolean;
  setOpenTemplates: Dispatch<React.SetStateAction<boolean>>;
  modal: ModalType;
  setModal: Dispatch<SetStateAction<ModalType>>;
  setCommentBlock: Dispatch<SetStateAction<Block | null>>;
  showAllComments: boolean;
  smallText: boolean;
  fullWidth: boolean;
  discardEdit: boolean;
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
  fontStyle: fontStyleType;
  mobileSideMenu: mobileSideMenuType;
  setMobileSideMenu: Dispatch<SetStateAction<mobileSideMenuType>>;
};
export type FrameProps = Template_Frame_SAME_Props & {
  page: Page;
};
const basicPageCover =
  "https://raw.githubusercontent.com/BadaHertz52/notion/master/src/assets/img/artificial-turf-g6e884a1d4_1920.jpg";
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
  setRoutePage,
  setTargetPageId,
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
  const { editPage, editBlock, addBlock } = useContext(ActionContext).actions;
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;
  const inner = document.getElementById("inner");
  const frameRef = useRef<HTMLDivElement>(null);
  const frameHtml = frameRef.current;
  const [templateHtml, setTemplateHtml] = useState<HTMLElement | null>(null);
  const editTime = JSON.stringify(Date.now());
  const firstBlocksId = page.firstBlocksId;
  const firstBlocks = firstBlocksId
    ? firstBlocksId.map((id: string) => findBlock(page, id).BLOCK)
    : null;
  const newPageFrame: boolean = page.firstBlocksId === null;
  const [openLoaderForCover, setOpenLoaderForCover] = useState<boolean>(false);
  const [decoOpen, setDecoOpen] = useState<boolean>(false);
  const [command, setCommand] = useState<Command>({
    boolean: false,
    command: null,
    targetBlock: null,
  });
  const [openIconModal, setOpenIconModal] = useState<boolean>(false);
  const [openPageCommentInput, setOpenPageCommentInput] =
    useState<boolean>(false);
  const [openLoader, setOpenLoader] = useState<boolean>(false);
  const [loaderTargetBlock, setLoaderTargetBlock] = useState<Block | null>(
    null
  );
  const [iconStyle, setIconStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [commandBlockPosition, setCBPosition] = useState<CSSProperties>();
  const [commandBlockStyle, setCommandBlockStyle] = useState<
    CSSProperties | undefined
  >(undefined);
  const [menuOpen, setOpenMenu] = useState<boolean>(false);
  const [selection, setSelection] = useState<selectionType | null>(null);
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
  const moveBlock = useRef<boolean>(false);
  /** block 이동 시, 이동 할 위치의 기준이 되는 block(block 은 pointBlockToMoveBlock.current의 앞에 위치하게됨) */
  const pointBlockToMoveBlock = useRef<Block | null>(null);
  const [mobileMenuTargetBlock, setMobileMenuTargetBlock] =
    useState<Block | null>(null);
  const maxWidth = innerWidth - 60;
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
  const frameInnerStyle: CSSProperties = {
    fontFamily: fontStyle,
    fontSize: `${fontSize}rem`,
    width: isMobile()
      ? "90%"
      : openTemplates
      ? "100%"
      : fullWidth
      ? `${maxWidth}px`
      : innerWidth > 900
      ? "900px"
      : "75%",
  };
  const pageCommentStyle: CSSProperties = {
    fontSize: `${fontSize}rem`,
  };
  const headerStyle: CSSProperties = {
    marginTop: page.header.cover ? "10px" : "30px",
  };
  const pageTitleStyle: CSSProperties = {
    fontSize: `${fontSize * 2}rem`,
  };
  const size =
    page.header.iconType === null
      ? innerWidth >= 768
        ? 72
        : 48
      : innerWidth >= 768
      ? 124
      : 72;
  const pageIconStyle: CSSProperties = {
    width: size,
    height: size,
    marginTop:
      page.header.cover === null
        ? 0
        : page.header.iconType === null
        ? innerWidth >= 768
          ? -39
          : -16
        : innerWidth >= 768
        ? -62
        : -16,
  };
  const onMouseMoveOnPH = () => {
    if (
      (page.header.icon === null ||
        page.header.cover === null ||
        page.header.comments === null) &&
      !decoOpen
    ) {
      setDecoOpen(true);
    }
  };
  const onMouseLeaveFromPH = () => {
    decoOpen && setDecoOpen(false);
  };
  const closeModal = (event: globalThis.MouseEvent) => {
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
  };

  const closeMenu = (event: globalThis.MouseEvent | MouseEvent) => {
    const mainMenu = document.getElementById("menu__main");
    const sideMenu = document.getElementById("sideMenu")?.firstElementChild;
    const mainMenuArea = mainMenu?.getClientRects()[0];
    const sideMenuArea = sideMenu?.getClientRects()[0];
    const isInrMain = detectRange(event, mainMenuArea);
    const isInSide = detectRange(event, sideMenuArea);

    if (sideMenuArea) {
      isInrMain || isInSide ? setOpenMenu(true) : setOpenMenu(false);
    } else {
      isInrMain ? setOpenMenu(true) : setOpenMenu(false);
    }
  };
  const closeComments = (event: globalThis.MouseEvent) => {
    if (openComment && commentBlock) {
      const commentsDoc = document.getElementById("block-comments");
      const commentBtn = document.getElementById(
        `${commentBlock.id}__contents`
      );
      if (commentsDoc && commentBtn) {
        const commentsDocDomRect = commentsDoc.getClientRects()[0];
        const commentBtnDomRect = commentBtn.getClientRects()[0];
        const isInComments = detectRange(event, commentsDocDomRect);
        const isInCommentsBtn = detectRange(event, commentBtnDomRect);
        if (!isInComments && !isInCommentsBtn) {
          setCommentBlock(null);
          setOpenComment(false);
        }
      }
    }
  };

  const onClickPageIcon = (event: React.MouseEvent) => {
    if (openIconModal !== true) {
      const frame = document.getElementsByClassName("frame")[0];
      const frameDomRect = frame.getClientRects()[0];
      const currentTarget = event.currentTarget;
      if (currentTarget.firstElementChild) {
        const domeRect = currentTarget.firstElementChild.getClientRects()[0];
        setIconStyle({
          position: "absolute",
          top: domeRect.bottom + 24,
          left: domeRect.left - frameDomRect.left,
        });
        setOpenIconModal(true);
      } else {
        console.error("Can't find currentTarget");
      }
    } else {
      setOpenIconModal(false);
    }
  };
  const onChangePageTitle = (event: ContentEditableEvent) => {
    const value = event.target.value;
    openTemplates && setTemplateItem(templateHtml, page);
    editPage(page.id, {
      ...page,
      header: {
        ...page.header,
        title: value,
      },
      editTime: editTime,
    });
  };

  const addRandomIcon = () => {
    const icon = randomIcon();
    const newPageWithIcon: Page = {
      ...page,
      header: {
        ...page.header,
        icon: icon,
        iconType: "emoji",
      },
      editTime: editTime,
    };
    openTemplates && setTemplateItem(templateHtml, page);
    editPage(page.id, newPageWithIcon);
  };

  const onClickAddCover = () => {
    const editedPage: Page = {
      ...page,
      header: {
        ...page.header,
        cover: basicPageCover,
      },
      editTime: editTime,
    };
    editPage(page.id, editedPage);
  };
  /**
   * [moveBlock]
   */
  const makeMoveBlockTrue = () => {
    if (moveTargetBlock) {
      moveBlock.current = true;
    }
  };
  /**
   * [moveBlock]  블록의 위치를 변경하고, 변경된 위치에 따라 page의 data도 변경하는 함수
   */
  const changeBlockPosition = () => {
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
  };
  /**
   * [moveBlock] block의 위치를 변경 시키는 것이 끝났을 때 (mouseUp | touchEnd) , 사용자가 지정한 위치대로 state를 변경하고 블록의 위치 변동을 위해 설정한 모든 것을 원래대로 되돌리는 함수
   */
  const stopMovingBlock = () => {
    if (moveBlock.current) {
      changeBlockPosition();
      moveBlock.current = false;
      setMoveTargetBlock(null);
      pointBlockToMoveBlock.current = null;
      const mainBlockOn = document.querySelector(".mainBlock.on");
      mainBlockOn?.classList.remove("on");
      const editableBlockOn = document.querySelector(".editableBlock.on");
      editableBlockOn?.classList.remove("on");
    }
  };
  /**
   * [moveBlock] 마우스, 터치의 이동에 따라 moveTargetBlock을 이동시키는 함수
   * @param clientX mouseEvent.clientX | touchEvent.touches[0].clientX
   * @param clientY mouseEvent.clientY | touchEvent.touches[0].clientY
   */
  const move_MoveTargetBlock = (clientX: number, clientY: number) => {
    if (moveTargetBlock && moveBlock.current) {
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
  };
  /**
   * [moveBlock - mobile] 모바일 브라우저에서, moveTargetBlock의 위치를 변경시키고 moveTargetBlock의 위치에 있는 element인지 여부에 따라 클래스를 변경하고, pointBlockToMoveBlock.current 의 value를 바꾸는 함수
   * @param event
   */
  const move_MoveTargetBlockInMobile = (event: TouchEvent<HTMLDivElement>) => {
    if (moveBlock.current) {
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
  };
  /**
   * .pageContent의 밑부분을 클릭 할때, 해당 페이지에 새로운 블록을 추가하는 함수
   * @param event
   */
  const onClickPageContentBottom = (event: MouseEvent) => {
    const pageContentEl = event.currentTarget;
    const clientX = event.clientX;
    const clientY = event.clientY;

    if (pageContentEl) {
      const pageContentDomRect = pageContentEl.getClientRects()[0];
      const pageContentPadding = getComputedStyle(
        pageContentEl,
        null
      ).getPropertyValue("padding-bottom");
      const padding = Number(
        pageContentPadding.slice(0, pageContentPadding.indexOf("px"))
      );

      const conditionX =
        clientX >= pageContentDomRect.x && clientX <= pageContentDomRect.right;

      const conditionY =
        clientY >= pageContentDomRect.bottom - padding &&
        clientY <= pageContentDomRect.bottom;
      /**
       * mouseEvent가  pageContent의 아래 부분에서 일어났는지에 대한 객체, event가 아래 부분에서 일어났으면 true, 밖의 영역에서 일어났으면 false
       */
      const isInner = conditionX && conditionY;
      if (isInner) {
        const randomNumber = Math.floor(Math.random() * (100000 - 1) + 1);
        const newBlock: Block = {
          ...blockSample,
          id: `${page.id}_${JSON.stringify(Date.now)}_${randomNumber}`,
          firstBlock: true,
        };

        if (page.firstBlocksId) {
          page.blocks && addBlock(page.id, newBlock, page.blocks.length, null);
        } else {
          addBlock(page.id, newBlock, 0, null);
        }
        setTemplateItem(templateHtml, page);
      }
    }
  };
  //new Frame
  /**
   * 새로 만든 페이지에 firstBlock을 생성하면서 페이지에 내용을 작성할 수 있도록 하는 함수
   * @returns page
   */
  const startNewPage = (): Page => {
    const firstBlock = makeNewBlock(page, null, "");
    const newPage: Page = {
      ...page,
      header: {
        ...page.header,
      },
      blocks: [firstBlock],
      blocksId: [firstBlock.id],
      firstBlocksId: [firstBlock.id],
      editTime: editTime,
    };
    return newPage;
  };

  const onClickEmptyWithIconBtn = () => {
    const icon = randomIcon();
    const newPage = startNewPage();
    const newPageWithIcon: Page = {
      ...newPage,
      header: {
        ...page.header,
        icon: icon,
        iconType: "emoji",
      },
    };
    setOpenTemplates(false);
    editPage(page.id, newPageWithIcon);
    setRoutePage(newPageWithIcon);
  };
  const onClickEmpty = () => {
    const newPage = startNewPage();
    setOpenTemplates(false);
    editPage(page.id, newPage);
    setRoutePage(newPage);
  };
  const onMouseEnterPC = (event: MouseEvent) => {
    const currentTarget = event?.currentTarget;
    currentTarget.classList.add("on");
  };
  const onMouseLeavePC = (event: MouseEvent) => {
    const currentTarget = event?.currentTarget;
    currentTarget.classList.remove("on");
  };

  const onClickChangeCoverBtn = () => {
    setOpenLoaderForCover(true);
    const pageCover = frameHtml?.querySelector(".page__header__cover");
    pageCover?.classList.remove("on");
  };
  const onClickTemplateBtn = () => {
    setOpenTemplates(true);
    sessionStorage.setItem("targetPageId", page.id);
  };
  // edit block using sessionStorage
  const updateBlock = () => {
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
  };
  /**
   * commandBlockPosition (type:CSSProperties)의 값을 변경하는 함수
   */
  const changeCBSposition = () => {
    if (command.boolean && command.targetBlock) {
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
  };
  window.onresize = () => {
    changeCBSposition();
  };
  /**
   * 모바일 환경에서 Selection 객체 여부를 탐색하고, 유의미한 Selection일 경우 BlockStyler를 열기 위한 작업(mobileMenu 나 BlockComment 창 닫기, selection state 변경, 선택된 내용을 표시할 수 있도록 block content 변경)을 시행함
   */
  const setItemForMobileMenu = (SELECTION: Selection) => {
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
      const blocKContentElement = contentEditableElement?.closest(".contents");
      if (blocKContentElement) {
        const blockId = blocKContentElement.id.replace("__contents", "");
        setMobileMenuTargetBlock(findBlock(page, blockId).BLOCK);
      }
    }
  };
  inner?.addEventListener("keyup", updateBlock);
  inner?.addEventListener("touchstart", updateBlock);
  inner?.addEventListener("click", (event: globalThis.MouseEvent) => {
    updateBlock();
    document.getElementById("menu__main") && closeMenu(event);
    document.getElementById("modal__menu") && closeModal(event);
    document.getElementById("block-comments") && closeComments(event);
    if (command.boolean) {
      const blockCommandBlock = document.getElementById("block__commandBlock");
      const commandDomRect = blockCommandBlock?.getClientRects()[0];
      const commandInputHtml = document.getElementById("commandInput");
      if (commandDomRect && commandInputHtml) {
        const isInnerCommand = detectRange(event, commandDomRect);
        !isInnerCommand &&
          event.target !== commandInputHtml &&
          setCommand({
            boolean: false,
            command: null,
            targetBlock: null,
          });
      }
    }
  });
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
  }, [command.boolean, command.targetBlock, openTemplates]);

  //window.onresize =changeCommentStyle;
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

  document.onselectionchange = () => {
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
  };
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
  }, [mobileMenuTargetBlock, mobileSideMenu.what, modal.open]);

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
  }, [openComment]);
  return (
    <div
      className={`frame ${newPageFrame ? "newPageFrame" : ""} ${
        isMobile() ? "mobile" : "web"
      }`}
      ref={frameRef}
      style={{
        overflowY:
          mobileMenuTargetBlock || (isMobile() && modal.open)
            ? "hidden"
            : "scroll",
      }}
    >
      <div
        className="frame__inner"
        id={`page-${page.id}`}
        style={frameInnerStyle}
        onMouseMove={(event) =>
          move_MoveTargetBlock(event.clientX, event.clientY)
        }
        onMouseUp={stopMovingBlock}
        onTouchMove={(event) => move_MoveTargetBlockInMobile(event)}
        onTouchEnd={stopMovingBlock}
      >
        <div className="page">
          <div
            className="page__header"
            style={headerStyle}
            onMouseMove={onMouseMoveOnPH}
            onMouseLeave={onMouseLeaveFromPH}
          >
            {page.header.cover && (
              <div
                className="page__header__cover"
                onMouseEnter={(event) => onMouseEnterPC(event)}
                onMouseLeave={(event) => onMouseLeavePC(event)}
              >
                <img src={page.header.cover} alt="page cover " />
                <button
                  className="btn-change-cover"
                  onClick={onClickChangeCoverBtn}
                >
                  change cover
                </button>
              </div>
            )}
            {openLoaderForCover && (
              <Loader
                block={null}
                page={page}
                editBlock={null}
                editPage={editPage}
                frameHtml={frameHtml}
                setOpenLoader={setOpenLoaderForCover}
                setLoaderTargetBlock={null}
              />
            )}
            <div className="page__header_notCover">
              <div
                className="page__icon-outBox"
                style={pageTitleStyle}
                onClick={onClickPageIcon}
              >
                <PageIcon
                  icon={page.header.icon}
                  iconType={page.header.iconType}
                  style={pageIconStyle}
                />
              </div>
              <div className="deco">
                {decoOpen && (
                  <div>
                    {page.header.icon === null && (
                      <button
                        className="deco__btn-icon"
                        onClick={addRandomIcon}
                      >
                        <BsFillEmojiSmileFill />
                        <span>Add Icon</span>
                      </button>
                    )}
                    {page.header.cover === null && (
                      <button
                        className="deco__btn-cover"
                        onClick={onClickAddCover}
                      >
                        <MdInsertPhoto />
                        <span>Add Cover</span>
                      </button>
                    )}
                    {page.header.comments === null && (
                      <button
                        className="deco__btn-comment"
                        onClick={() => setOpenPageCommentInput(true)}
                      >
                        <BiMessageDetail />
                        <span>Add Comment</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="page__title" style={pageTitleStyle}>
                <ContentEditable
                  html={page.header.title}
                  onChange={onChangePageTitle}
                />
              </div>
              <div className="page__comments" style={pageCommentStyle}>
                {page.header.comments ? (
                  page.header.comments.map((comment: MainCommentType) => (
                    <Comments
                      key={`pageComment_${comment.id}`}
                      block={null}
                      page={page}
                      pageId={page.id}
                      userName={userName}
                      frameHtml={frameHtml}
                      discardEdit={discardEdit}
                      setDiscardEdit={setDiscardEdit}
                      select={null}
                      openComment={false}
                      showAllComments={showAllComments}
                    />
                  ))
                ) : openPageCommentInput ? (
                  <CommentInput
                    page={page}
                    pageId={page.id}
                    userName={userName}
                    mainComment={null}
                    subComment={null}
                    editBlock={editBlock}
                    editPage={editPage}
                    commentBlock={null}
                    allComments={page.header.comments}
                    setAllComments={null}
                    setModal={null}
                    addOrEdit={"add"}
                    setEdit={setOpenPageCommentInput}
                    templateHtml={templateHtml}
                    frameHtml={frameHtml}
                  />
                ) : (
                  newPageFrame && (
                    <div>
                      Press Enter to continue with an empty page or pick a
                      template
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          {openIconModal && (
            <IconModal
              currentPageId={page.id}
              block={null}
              page={page}
              style={iconStyle}
              setOpenIconModal={setOpenIconModal}
            />
          )}
          <div className="page__contents" onClick={onClickPageContentBottom}>
            {!newPageFrame ? (
              <div
                className="page__contents__inner"
                onMouseMove={makeMoveBlockTrue}
                onTouchMove={makeMoveBlockTrue}
              >
                {firstBlocks &&
                  firstBlocks.map((block: Block) => {
                    return (
                      <EditableBlock
                        key={block.id}
                        pages={pages}
                        pagesId={pagesId}
                        page={page}
                        block={block}
                        fontSize={fontSize}
                        moveBlock={moveBlock}
                        setMoveTargetBlock={setMoveTargetBlock}
                        pointBlockToMoveBlock={pointBlockToMoveBlock}
                        command={command}
                        setCommand={setCommand}
                        setTargetPageId={setTargetPageId}
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
                    );
                  })}
              </div>
            ) : (
              <div className="page__contents__inner">
                <button onClick={onClickEmptyWithIconBtn}>
                  <GrDocumentText />
                  <span>Empty with icon</span>
                </button>
                <button onClick={onClickEmpty}>
                  <GrDocument />
                  <span>Empty</span>
                </button>
                {page.type !== "template" && (
                  <button onClick={onClickTemplateBtn}>
                    <HiTemplate />
                    <span>Templates</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {command.boolean && command.targetBlock && (
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
          setTargetPageId={setTargetPageId}
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
              setTargetPageId={setTargetPageId}
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
          moveBlock={moveBlock}
          setMoveTargetBlock={setMoveTargetBlock}
          pointBlockToMoveBlock={pointBlockToMoveBlock}
          command={command}
          setCommand={setCommand}
          setTargetPageId={setTargetPageId}
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
          setTargetPageId={setTargetPageId}
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
          setTargetPageId={setTargetPageId}
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
