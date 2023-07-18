import React, {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  MouseEvent,
  SetStateAction,
  SyntheticEvent,
  TouchEvent,
  useEffect,
  useRef,
  useContext,
} from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import {
  Block,
  BlockType,
  blockTypes,
  findPage,
  findParentBlock,
  findPreviousBlockInDoc,
  MainCommentType,
  makeNewBlock,
  Page,
} from "../modules/notion";
import { Command } from "./Frame";
import ImageContent from "./ImageContent";
import { ActionContext, selectionType } from "../containers/NotionRouter";
import ScreenOnly from "./ScreenOnly";
import { isMobile, selectContent, setTemplateItem } from "../fn";

type BlockComponentProps = {
  pages: Page[];
  pagesId: string[];
  block: Block;
  page: Page;
  command: Command;
  setCommand: Dispatch<SetStateAction<Command>>;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  setTargetPageId: Dispatch<SetStateAction<string>>;
  setOpenLoader: Dispatch<SetStateAction<boolean>>;
  setLoaderTargetBlock: Dispatch<SetStateAction<Block | null>>;
  closeMenu: (event: globalThis.MouseEvent | MouseEvent) => void;
  templateHtml: HTMLElement | null;
  setSelection: Dispatch<SetStateAction<selectionType | null>>;
  setMobileMenuTargetBlock: Dispatch<SetStateAction<Block | null>>;
  onClickCommentBtn: (block: Block) => void;
  setMoveTargetBlock: Dispatch<SetStateAction<Block | null>>;
  moveBlock: React.MutableRefObject<boolean>;
};

export type itemType = {
  block: Block;
  blockIndex: number;
};

const BlockComponent = ({
  pages,
  pagesId,
  block,
  page,
  command,
  setCommand,
  setOpenComment,
  setTargetPageId,
  setOpenLoader,
  setLoaderTargetBlock,
  closeMenu,
  templateHtml,
  setSelection,
  setMobileMenuTargetBlock,
  onClickCommentBtn,
  setMoveTargetBlock,
  moveBlock,
}: BlockComponentProps) => {
  const { editBlock, addBlock, changeToSub, raiseBlock, deleteBlock } =
    useContext(ActionContext).actions;
  /**
   * 모바일 브라우저에서, element을 터치 할때 사용자가 element을 이동하기 위해 touch 한 것인지 판별하기 위한 조건 중 하나
   */
  const startMarkMoveBlock = useRef<boolean>(false);
  const editTime = JSON.stringify(Date.now);
  const contentEditableRef = useRef<HTMLElement>(null);
  /**
   * 키보드 방향키(위/아래)로 이동 가능한 블럭
   */
  const possibleBlocks: Block[] | null = page.blocks
    ? page.blocks.filter(
        (block: Block) => block.type !== "image" && block.type !== "page"
      )
    : null;
  const possibleBlocksId: string[] | null = possibleBlocks
    ? possibleBlocks.map((block: Block) => block.id)
    : null;
  /**
   * 마우스가 block위를 움직일 경우, 해당 block의 element 옆에 blockFn component를 보여주는 함수
   * @param event mouseEvent
   */
  const showBlockFn = (event: MouseEvent) => {
    closeMenu(event);
    const currentTarget = event.currentTarget;
    const mainBlock = currentTarget.parentElement?.parentElement?.parentElement;
    if (mainBlock && mainBlock) {
      const mainBlockDomRect = mainBlock?.getClientRects()[0];
      const editor = document.getElementsByClassName("editor")[0];
      const blockFn =
        templateHtml === null
          ? editor.querySelector(".blockFn")
          : templateHtml.querySelector(".blockFn");
      blockFn?.classList.toggle("on");
      blockFn?.classList.contains("on")
        ? sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(block))
        : sessionStorage.removeItem("blockFnTargetBlock");
      if (mainBlockDomRect) {
        if (templateHtml === null) {
          const editorDomRect = editor.getClientRects()[0];
          const top = mainBlockDomRect.top + editor.scrollTop;
          const left = mainBlockDomRect.x - editorDomRect.x - 45;
          const blockFnStyle = `top:${top}px; left:${left}px`;
          blockFn?.setAttribute("style", blockFnStyle);
        } else {
          const templateDomRect = templateHtml.getClientRects()[0];
          const top = mainBlockDomRect.top - templateDomRect.top;
          const left = mainBlockDomRect.x - templateDomRect.x - 45;
          blockFn?.setAttribute("style", `top:${top}px; left:${left}px`);
        }
      }
    }
  };
  /**
   * 모바일 브라우저에서 특정 이벤트가 발생 했을 때 mobileBlockMenu 를 열어 주는 함수
   */
  const openMobileBlockMenu = () => {
    if (block.comments === null) {
      setMobileMenuTargetBlock(block);
      setSelection(null);
    }
  };
  /**
   * ContentEditable에서 block 의 content을 수정하는 함수 ,
   *  웹 브라우저에서 "/"로 시작하면 block 의 type을 변경할 수 있음
   * @param event ContentEditableEvent
   */
  const onChangeContents = (event: ContentEditableEvent) => {
    if (page.blocks && page.blocksId) {
      setTemplateItem(templateHtml, page);
      const value = event.target.value;
      const targetBlockIndex = page.blocksId.indexOf(block.id);
      /**
       * value값에 따라 새로운 블록을 생성하거나 기존 block의 content를 수정하는 함수
       */
      const changeBlockContent = () => {
        if (value.includes("<div>")) {
          //enter 시에 새로운 블록 생성
          const start = value.indexOf("<div>");
          const end = value.indexOf("</div>");
          const editedContents = value.slice(0, start);
          const newBlockContents = value.slice(start + 5, end);
          const newBlock: Block = {
            ...makeNewBlock(page, block, newBlockContents),
            firstBlock: block.firstBlock,
            subBlocksId: block.subBlocksId,
            parentBlocksId: block.parentBlocksId,
          };
          if (
            block.contents !== editedContents ||
            block.contents === "" ||
            block.subBlocksId
          ) {
            const editedBlock: Block = {
              ...block,
              contents:
                block.contents !== editedContents
                  ? editedContents
                  : block.contents,
              subBlocksId: block.subBlocksId ? null : block.subBlocksId,
              editTime: editTime,
            };
            editBlock(page.id, editedBlock);
          }
          if (block.type === "toggle") {
            const newSubToggleBlock: Block = {
              ...newBlock,
              parentBlocksId: [block.id],
              firstBlock: false,
            };
            addBlock(
              page.id,
              newSubToggleBlock,
              targetBlockIndex + 1,
              block.id
            );
          } else {
            addBlock(page.id, newBlock, targetBlockIndex + 1, block.id);
          }
        } else {
          // edit block
          const cursor = document.getSelection();
          const offset = cursor?.anchorOffset;
          if (!(block.contents === "" && offset === 0 && value === "")) {
            const editedBlock: Block = {
              ...block,
              contents: value,
              editTime: editTime,
            };
            if (block.contents !== value) {
              const item = {
                pageId: page.id,
                block: editedBlock,
              };
              sessionStorage.setItem("itemsTobeEdited", JSON.stringify(item));
            }
          }
        }
      };
      if (!value.startsWith("/")) {
        changeBlockContent();
      } else {
        // 타입 변경 명령어로 commandBlock 을 엶
        if (!isMobile()) {
          // web browser 에서
          setOpenComment(false);
          setCommand({
            open: true,
            command: "/",
            targetBlock: block,
          });
        }
      }
    }
  };
  /**
   * focus를 화면 상의 다음 블록의 contentEditable 에 옮기는 함수
   * @param nextBlockId 화면상의 다음 블록의 아이디
   * @param targetBlock
   */
  const moveFocus = (nextBlockId: string, targetBlock: Block) => {
    const contentsHtml = document.getElementById(`${nextBlockId}__contents`);
    if (contentsHtml) {
      const focusTargetHtml = contentsHtml.firstElementChild as HTMLElement;
      focusTargetHtml.focus();
    } else {
      console.error(`Can't find .${targetBlock.id}__contents html`);
    }
  };
  /**
   * 유저가 누른 키보드 키(tab,backspace,arrow up,arrow down)에 따라 서로 다른 함수를 작동시키는 함수
   * tab 키 : 들여쓰기 (해당 이벤트가 일어난 block을 이전 block의 subBlock으로 변경)
   * backspace키 : block 의 contents를 수정, contents가 없을 경우에는 block을 삭제
   * arrow up, arrow down: block을 기준으로 커셔의 위치를 이동 시킴
   * @param event KeyboardEvent<HTMLDivElement>
   */
  const onKeyDownContents = (event: KeyboardEvent<HTMLDivElement>) => {
    const code = event.code.toLowerCase();
    switch (code) {
      case "tab":
        event.preventDefault();
        setTemplateItem(templateHtml, page);
        const previousBlockIdInDoc = findPreviousBlockInDoc(page, block)
          .previousBlockInDoc.id;
        if (previousBlockIdInDoc) {
          changeToSub(page.id, block, previousBlockIdInDoc);
        } else {
          console.error(
            `Cant' find block in front of ${block.id}block on screen`
          );
        }

        break;
      case "backspace":
        setTemplateItem(templateHtml, page);
        const text = event.currentTarget.innerText;
        const cursor = document.getSelection();
        const offset = cursor?.anchorOffset;
        if (offset === 0 && text === "") {
          deleteBlock(page.id, block, false);
        }
        if (offset === 0 && text !== "") {
          raiseBlock(page.id, block);
        }

        break;
      case "arrowup":
        if (page.firstBlocksId && page.firstBlocksId[0] !== block.id) {
          let doing: boolean = true;
          let referenceBlock: Block = block;
          while (doing) {
            let previousBlockInDoc = findPreviousBlockInDoc(
              page,
              referenceBlock
            ).previousBlockInDoc;

            if (
              previousBlockInDoc.type.includes("List") &&
              previousBlockInDoc.subBlocksId?.[0] === referenceBlock.id
            ) {
              previousBlockInDoc = findPreviousBlockInDoc(
                page,
                previousBlockInDoc
              ).previousBlockInDoc;
            }

            if (possibleBlocksId?.includes(previousBlockInDoc.id)) {
              if (
                previousBlockInDoc.type.includes("List") &&
                previousBlockInDoc.subBlocksId
              ) {
                moveFocus(
                  previousBlockInDoc.subBlocksId[
                    previousBlockInDoc.subBlocksId.length - 1
                  ],
                  block
                );
              } else {
                moveFocus(previousBlockInDoc.id, block);
              }
              doing = false;
            } else {
              referenceBlock = previousBlockInDoc;
            }
          }
        }

        break;
      case "arrowdown":
        /**
         * cursor이동이 가능한 다음 블록의 type에 따라 어디로 cursor를 이동할 지 결정하는 함수
         * @param nextBlockId : 다음에 이동할 블록의 id
         */
        const setNextHtmlId = (nextBlockId: string) => {
          if (possibleBlocks && possibleBlocksId) {
            const index = possibleBlocksId.indexOf(nextBlockId);
            const nextBlock = possibleBlocks[index];
            if (nextBlock.type.includes("List") && nextBlock.subBlocksId) {
              moveFocus(nextBlock.subBlocksId[0], block);
            } else {
              moveFocus(nextBlockId, block);
            }
          }
        };
        /**
         * firstBlock== true 인 블록의 화면상의 다음 블록을 찾아 cursor를 해당 블록의 contentEditable로 옮겨줄 함수
         * @param firstBlock : 기준이 되는 블록
         */
        const findNextBlockOfFirstBlock = (firstBlock: Block) => {
          if (possibleBlocks && possibleBlocksId) {
            if (page.firstBlocksId) {
              if (firstBlock.subBlocksId === null) {
                const blockIndexAsFirstBlock = page.firstBlocksId.indexOf(
                  firstBlock.id
                );
                if (blockIndexAsFirstBlock < page.firstBlocksId.length - 1) {
                  for (
                    let i = 1;
                    i < page.firstBlocksId.length - blockIndexAsFirstBlock;
                    i++
                  ) {
                    let nextBlockId =
                      page.firstBlocksId[blockIndexAsFirstBlock + i];
                    if (possibleBlocksId.includes(nextBlockId)) {
                      setNextHtmlId(nextBlockId);
                      i = page.firstBlocksId.length;
                    }
                  }
                }
              } else {
                for (let i = 0; i < firstBlock.subBlocksId.length; i++) {
                  const firstSubBlockId = firstBlock.subBlocksId[i];
                  if (possibleBlocksId.includes(firstSubBlockId)) {
                    setNextHtmlId(firstSubBlockId);
                    i = firstBlock.subBlocksId.length;
                  }
                }
              }
            }
          }
        };
        /**
         *  어떤 블록의 subBlock인 블록의 화면상의 다음 블록을 찾아 cursor를 해당 블록의 contentEditable로 옮겨줄 함수
         * @param subBlock :  다음 블록을 찾을 기준이 되는 블록
         */
        const findNextBlockOfSubBlock = (subBlock: Block) => {
          if (subBlock.subBlocksId === null) {
            const findNextBlockByParent = (block: Block) => {
              const parentBlock = findParentBlock(page, block).parentBlock;
              if (parentBlock.subBlocksId) {
                const blockIndexAsSubBlock = parentBlock.subBlocksId.indexOf(
                  block.id
                );
                if (
                  blockIndexAsSubBlock ===
                  parentBlock.subBlocksId.length - 1
                ) {
                  if (parentBlock.firstBlock && page.firstBlocksId) {
                    const parentBlockIndexAsFirst = page.firstBlocksId.indexOf(
                      parentBlock.id
                    );
                    if (parentBlockIndexAsFirst < page.firstBlocksId.length) {
                      for (
                        let i = 1;
                        i < page.firstBlocksId.length - parentBlockIndexAsFirst;
                        i++
                      ) {
                        const nextBlockId =
                          page.firstBlocksId[parentBlockIndexAsFirst + i];
                        if (possibleBlocksId?.includes(nextBlockId)) {
                          setNextHtmlId(nextBlockId);
                          i = page.firstBlocksId.length - 1;
                        }
                      }
                    }
                  } else {
                    findNextBlockByParent(parentBlock);
                  }
                } else {
                  for (
                    let i = 1;
                    i < parentBlock.subBlocksId.length - blockIndexAsSubBlock;
                    i++
                  ) {
                    const nextBlockId =
                      parentBlock.subBlocksId[blockIndexAsSubBlock + i];
                    if (possibleBlocksId?.includes(nextBlockId)) {
                      setNextHtmlId(nextBlockId);
                      i = parentBlock.subBlocksId.length;
                    }
                  }
                }
              }
            };

            findNextBlockByParent(subBlock);
          } else {
            const firstSubBlockId = subBlock.subBlocksId[0];
            if (possibleBlocksId?.includes(firstSubBlockId)) {
              moveFocus(firstSubBlockId, block);
            }
          }
        };
        if (block.firstBlock) {
          findNextBlockOfFirstBlock(block);
        } else {
          findNextBlockOfSubBlock(block);
        }

        break;
      default:
        break;
    }
  };

  /**
   *block의 content 를 마우스로 선택 시, block의 content를 선택된 부분(class 가 selected인 span element)과 아닌 부분으로 수정하는 함수
   */
  const onSelectInPC = (event: SyntheticEvent<HTMLDivElement>) => {
    if (!isMobile()) {
      const SELECTION = window.getSelection();
      if (block) {
        selectContent(
          SELECTION,
          block,
          contentEditableRef.current,
          editBlock,
          page,
          setSelection
        );
      }
    }
  };
  /**
   * BlockComponent 중 link 가 있는 element를 클릭 했을 경우 , 해당 링크를 여는 함수
   */
  const onClickContentEditable = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.className === "link") {
      const href = target.getAttribute("href");
      const openType = target.getAttribute("target");
      href && openType && window.open(href, openType);
    }
    if (target.classList.contains("text_commentBtn")) {
      sessionStorage.setItem(
        "mainCommentId",
        target.classList.value
          .split(" ")
          .filter((i) => i.includes("mainId"))[0]
          .replace("mainId_", "")
      );
      onClickCommentBtn(block);
    }
  };
  /**
   * input 창을 통해 command의 값을 변경 시키는 함수
   * @param event ChangeEvent<HTMLInputElement>
   */
  function commandChange(event: ChangeEvent<HTMLInputElement>) {
    setTemplateItem(templateHtml, page);
    const value = event.target.value;
    const trueOrFalse = value.startsWith("/");
    if (trueOrFalse) {
      setCommand({
        open: true,
        command: value.toLowerCase(),
        targetBlock: command.targetBlock,
      });
    } else {
      setCommand({
        open: false,
        command: null,
        targetBlock: null,
      });
    }
  }
  /**
   * enter 키를 누르면 block 의 type을 commandBlock 에서 현재 제일 위에 있는 type으로 변경하는 함수
   * @param event KeyboardEvent<HTMLInputElement>
   */
  function commandKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    const code = event.code;
    const firstOn = document.querySelector(".btn-command.on.first");
    if (code === "Enter" && command.targetBlock) {
      const name = firstOn?.getAttribute("name") as string;
      const blockType: BlockType = blockTypes.filter((type) =>
        name.includes(type)
      )[0];
      const newBlock: Block = {
        ...command.targetBlock,
        type: blockType,
        editTime: editTime,
      };
      editBlock(page.id, newBlock);
      setCommand({
        open: false,
        command: null,
        targetBlock: null,
      });
      setTemplateItem(templateHtml, page);
    }
  }
  /**
   * block type이 page인 block에 대한 BlockComponent를 클릭 할 경우, 해당 page로 이동하는 함수
   */
  const onClickBlockContents = () => {
    block.type === "page" && setTargetPageId(block.id);
  };
  /**
   * image type의 block에 넣은 이미지 파일을 선택하기 위한 버튼을 클릭한 경우 작동하는 함수로, Loader component를 엶
   */
  const onClickAddFileBtn = () => {
    setOpenLoader(true);
    setLoaderTargetBlock(block);
  };
  const BlockContentEditable = () => {
    const getPageTitle = () => {
      const targetPage = findPage(pagesId, pages, block.id);
      const title = targetPage.header.title;
      return title;
    };
    const blockContents =
      block.type === "page" ? getPageTitle() : block.contents;
    useEffect(() => {
      if (command.open) {
        const commentInputHtml = document.getElementById("commandInput");
        if (commentInputHtml) {
          commentInputHtml.focus();
        }
      }
    }, []);

    return (
      <>
        {!command.command ||
        (command.targetBlock && command.targetBlock.id !== block.id) ? (
          <ContentEditable
            className="contentEditable"
            placeholder="Type '/' for commands"
            html={blockContents}
            innerRef={contentEditableRef}
            onChange={(event) => onChangeContents(event)}
            onKeyDown={(event) => onKeyDownContents(event)}
            onSelect={(event) => onSelectInPC(event)}
            onTouchEnd={openMobileBlockMenu}
            onClick={(event) => onClickContentEditable(event)}
          />
        ) : (
          <>
            <label htmlFor="commandInput">
              <ScreenOnly text="content input" />
            </label>
            <input
              type="text"
              title="content input"
              tabIndex={-1}
              value={command.command}
              id="commandInput"
              className="contentEditable"
              onChange={commandChange}
              onKeyUp={commandKeyUp}
            />
          </>
        )}
      </>
    );
  };
  const onClickContent = (event: MouseEvent<HTMLElement>) => {
    if (event.currentTarget.classList.contains("btn-comment")) {
      onClickCommentBtn(block);
    }
  };
  /**
   * [moveBlock - mobile] readyToMoveBlock 을 통해 위치를 변경시킬 블럭으로 해당 요소에 touch move 이벤트가 감지 되었을때,
   * moveTargetBlock을 설정하고 해당 요소의 클래스를 원래대로 복귀하는 함수
   * @param event TouchEvent
   */
  const markMoveTargetBlock = (event: TouchEvent<HTMLDivElement>) => {
    if (event.currentTarget.classList.contains("on")) {
      setMoveTargetBlock(block);
      const target = event.target as HTMLDivElement;
      target.classList.remove("on");
    }
  };
  /**
   *[moveBlock - mobile]  moveBlock.current 로 Frame 내에서 움직임이 감지 되었다면, startMarkMoveBlock.current 를 true로 변환하고,  블록 위치변경을 위한 블록 선택임을 구별하기 위해 setTimeOut 을 사용해서 일정 시간이 지난후에도 startMoveBlock.current가 참일 때 event의 타켓인 요소의 클래스에 on을 추가해 moveTargetBlock을 설정할 준비를 하는 함수
   * @param event ToucheEvent
   */
  const readyToMoveBlock = (event: TouchEvent<HTMLDivElement>) => {
    if (!moveBlock.current) {
      startMarkMoveBlock.current = true;
    }
    setTimeout(() => {
      if (startMarkMoveBlock.current) {
        const target = event.target as HTMLElement;
        target.classList.add("on");
      }
    }, 2000);
  };
  return (
    <div
      className={`${block.type}-blockComponent blockComponent`}
      onClick={onClickBlockContents}
      onMouseOver={showBlockFn}
      onTouchStart={(event) => readyToMoveBlock(event)}
      onTouchEnd={() => {
        if (!moveBlock.current) startMarkMoveBlock.current = false;
      }}
      onTouchCancel={() => (startMarkMoveBlock.current = false)}
      onTouchMove={(event) => markMoveTargetBlock(event)}
    >
      {block.type === "page" ? (
        <button
          className="contents page__title"
          title="open contents of which type page"
          id={`${block.id}__contents`}
        >
          <ScreenOnly text="open contents of which type page" />
          <BlockContentEditable />
        </button>
      ) : block.type === "image" ? (
        block.contents === "" ? (
          <button
            className="btn-addBlockFile"
            title="btn to add image"
            onClick={onClickAddFileBtn}
          >
            <ScreenOnly text="btn to add image" />
            <span className="icon-addBlockFile">
              <MdOutlinePhotoSizeSelectActual />
            </span>
            <span>
              Add a {block.type.slice(0, block.type.indexOf("media"))}
            </span>
          </button>
        ) : (
          <>
            <ImageContent page={page} block={block} editBlock={editBlock} />
          </>
        )
      ) : (
        <div
          id={`${block.id}__contents`}
          className={`contents 
          ${
            block.comments &&
            block.comments
              .map((m: MainCommentType) => m.selectedText === null)
              .includes(true)
              ? "btn-comment"
              : ""
          }`}
          onClick={onClickContent}
        >
          <BlockContentEditable />
        </div>
      )}
    </div>
  );
};

export default React.memo(BlockComponent);
