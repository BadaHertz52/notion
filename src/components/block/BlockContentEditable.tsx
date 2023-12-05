import React, {
  useEffect,
  KeyboardEvent,
  useCallback,
  useContext,
  Dispatch,
  SetStateAction,
  MouseEvent,
  useRef,
  TouchEvent,
} from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { CommandInput } from "../index";

import { SESSION_KEY } from "../../constants";
import { ActionContext } from "../../contexts";
import { Block, Page, Command, SelectionType } from "../../types";
import {
  findPage,
  findParentBlock,
  findPreviousBlockInDoc,
  makeNewBlock,
  isMobile,
  selectContent,
  setTemplateItem,
  getEditTime,
} from "../../utils";

export type BlockContendEditableProps = {
  block: Block;
  command: Command;
  onClickCommentBtn: (block: Block) => void;
  page: Page;
  pages: Page[];
  pagesId: string[];
  templateHtml: HTMLElement | null;
  setMobileMenuTargetBlock: Dispatch<SetStateAction<Block | null>>;
  setCommand: Dispatch<SetStateAction<Command>>;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  setSelection: Dispatch<SetStateAction<SelectionType | null>>;
};

const BlockContentEditable = ({
  pagesId,
  pages,
  page,
  block,
  templateHtml,
  command,
  setCommand,
  setOpenComment,
  setSelection,
  setMobileMenuTargetBlock,
  onClickCommentBtn,
}: BlockContendEditableProps) => {
  const { editBlock, addBlock, changeToSub, raiseBlock, deleteBlock } =
    useContext(ActionContext).actions;
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
   * ContentEditable에서 block 의 content을 수정하는 함수 ,
   *  웹 브라우저에서 "/"로 시작하면 block 의 type을 변경할 수 있음
   * @param event ContentEditableEvent
   */
  const onChangeContents = useCallback(
    (event: ContentEditableEvent) => {
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
                editTime: getEditTime(),
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
                editTime: getEditTime(),
              };
              if (block.contents !== value) {
                const item = {
                  pageId: page.id,
                  block: editedBlock,
                };
                sessionStorage.setItem(
                  SESSION_KEY.blockToBeEdited,
                  JSON.stringify(item)
                );
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
    },
    [addBlock, block, editBlock, page, setCommand, setOpenComment, templateHtml]
  );
  /**
   * focus를 화면 상의 다음 블록의 contentEditable 에 옮기는 함수
   * @param nextBlockId 화면상의 다음 블록의 아이디
   * @param targetBlock
   */
  const moveFocus = useCallback((nextBlockId: string, targetBlock: Block) => {
    const contentsHtml = document.getElementById(`${nextBlockId}__contents`);
    if (contentsHtml) {
      const focusTargetHtml = contentsHtml.firstElementChild as HTMLElement;
      focusTargetHtml.focus();
    } else {
      console.error(`Can't find .${targetBlock.id}__contents html`);
    }
  }, []);
  /**
   * cursor이동이 가능한 다음 블록의 type에 따라 어디로 cursor를 이동할 지 결정하는 함수
   * @param nextBlockId : 다음에 이동할 블록의 id
   */
  const setNextHtmlId = useCallback(
    (nextBlockId: string) => {
      if (possibleBlocks && possibleBlocksId) {
        const index = possibleBlocksId.indexOf(nextBlockId);
        const nextBlock = possibleBlocks[index];
        if (nextBlock.type.includes("List") && nextBlock.subBlocksId) {
          moveFocus(nextBlock.subBlocksId[0], block);
        } else {
          moveFocus(nextBlockId, block);
        }
      }
    },
    [block, moveFocus, possibleBlocks, possibleBlocksId]
  );

  const findNextBlockByParent = useCallback(
    (block: Block) => {
      const parentBlock = findParentBlock(page, block).parentBlock;
      if (parentBlock.subBlocksId) {
        const blockIndexAsSubBlock = parentBlock.subBlocksId.indexOf(block.id);
        if (blockIndexAsSubBlock === parentBlock.subBlocksId.length - 1) {
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
    },
    [page, possibleBlocksId, setNextHtmlId]
  );
  /**
   *  어떤 블록의 subBlock인 블록의 화면상의 다음 블록을 찾아 cursor를 해당 블록의 contentEditable로 옮겨줄 함수
   * @param subBlock :  다음 블록을 찾을 기준이 되는 블록
   */
  const findNextBlockOfSubBlock = useCallback(
    (subBlock: Block) => {
      if (subBlock.subBlocksId === null) {
        findNextBlockByParent(subBlock);
      } else {
        const firstSubBlockId = subBlock.subBlocksId[0];
        if (possibleBlocksId?.includes(firstSubBlockId)) {
          moveFocus(firstSubBlockId, block);
        }
      }
    },
    [block, findNextBlockByParent, moveFocus, possibleBlocksId]
  );

  /**
   * firstBlock== true 인 블록의 화면상의 다음 블록을 찾아 cursor를 해당 블록의 contentEditable로 옮겨줄 함수
   * @param firstBlock : 기준이 되는 블록
   */
  const findNextBlockOfFirstBlock = useCallback(
    (firstBlock: Block) => {
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
    },
    [page.firstBlocksId, possibleBlocks, possibleBlocksId, setNextHtmlId]
  );
  /**
   * 유저가 누른 키보드 키(tab,backspace,arrow up,arrow down)에 따라 서로 다른 함수를 작동시키는 함수
   * tab 키 : 들여쓰기 (해당 이벤트가 일어난 block을 이전 block의 subBlock으로 변경)
   * backspace키 : block 의 contents를 수정, contents가 없을 경우에는 block을 삭제
   * arrow up, arrow down: block을 기준으로 커셔의 위치를 이동 시킴
   * @param event KeyboardEvent<HTMLDivElement>
   */
  const onKeyDownContents = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.currentTarget !== event.target) return;
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
          if (block.firstBlock) {
            findNextBlockOfFirstBlock(block);
          } else {
            findNextBlockOfSubBlock(block);
          }

          break;
        default:
          break;
      }
    },
    [
      block,
      changeToSub,
      deleteBlock,
      moveFocus,
      page,
      raiseBlock,
      templateHtml,
      findNextBlockOfFirstBlock,
      findNextBlockOfSubBlock,
      possibleBlocksId,
    ]
  );
  const getPageTitle = () => {
    const targetPage = findPage(pagesId, pages, block.id);
    const title = targetPage.header.title;
    return title;
  };
  const blockContents = block.type === "page" ? getPageTitle() : block.contents;

  /**
   *block의 content 를 마우스로 선택 시, block의 content를 선택된 부분(class 가 selected인 span element)과 아닌 부분으로 수정하는 함수
   */
  const onSelectInPC = useCallback(
    (event: React.SyntheticEvent<HTMLDivElement, Event>) => {
      if (event.currentTarget !== event.target) return;
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
    },
    [block, editBlock, page, setSelection, contentEditableRef]
  );

  /**
   * 모바일 브라우저에서 특정 이벤트가 발생 했을 때 mobileMenu 를 열어 주는 함수
   */
  const openMobileMenu = useCallback(
    (event: TouchEvent) => {
      if (event.currentTarget !== event.target) return;
      if (!block.comments) {
        setMobileMenuTargetBlock(block);
        setSelection(null);
      }
    },
    [block, setMobileMenuTargetBlock, setSelection]
  );
  /**
   * BlockComponent 중 link 가 있는 element를 클릭 했을 경우 , 해당 링크를 여는 함수
   */
  const openLink = useCallback((target: HTMLElement) => {
    const href = target.getAttribute("href");
    const openType = target.getAttribute("target");
    href && openType && window.open(href, openType);
  }, []);

  const openBlockComments = useCallback(
    (target: HTMLElement) => {
      sessionStorage.setItem(
        SESSION_KEY.mainCommentId,
        target.classList.value
          .split(" ")
          .filter((i) => i.includes("mainId"))[0]
          .replace("mainId_", "")
      );
      onClickCommentBtn(block);
    },
    [block, onClickCommentBtn]
  );

  const onClickContentEditable = useCallback(
    (event: MouseEvent) => {
      if (event.currentTarget !== event.target) return;
      const target = event.target as HTMLElement;
      if (target.className === "link") {
        openLink(target);
        return;
      }
      if (target.classList.contains("text_commentBtn")) {
        openBlockComments(target);
        return;
      }
    },
    [openLink, openBlockComments]
  );

  useEffect(() => {
    if (command.open) {
      const commentInputHtml = document.getElementById("commandInput");
      if (commentInputHtml) {
        commentInputHtml.focus();
      }
    }
  }, [command.open]);

  return (
    <>
      {!command.command ||
      (command.targetBlock && command.targetBlock.id !== block.id) ? (
        <ContentEditable
          className="contentEditable"
          placeholder="Type '/' for commands"
          html={blockContents}
          innerRef={contentEditableRef}
          onChange={onChangeContents}
          onKeyDown={onKeyDownContents}
          onSelect={onSelectInPC}
          onTouchEnd={openMobileMenu}
          onClick={onClickContentEditable}
        />
      ) : (
        <CommandInput
          templateHtml={templateHtml}
          page={page}
          command={command}
          setTemplateItem={setTemplateItem}
          setCommand={setCommand}
        />
      )}
    </>
  );
};

export default React.memo(BlockContentEditable);
