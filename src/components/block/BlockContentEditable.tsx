import React, {
  KeyboardEvent,
  useCallback,
  useContext,
  MouseEvent,
  useRef,
  useState,
  CSSProperties,
} from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { CommandInput, CommandModal } from "../index";

import { SESSION_KEY } from "../../constants";
import { ActionContext } from "../../contexts";
import { Block, Page } from "../../types";
import {
  findPage,
  findParentBlock,
  findPreviousBlockInDoc,
  makeNewBlock,
  setOriginTemplateItem,
  getEditTime,
} from "../../utils";

export type BlockContendEditableProps = {
  block: Block;
  onClickCommentBtn?: (block: Block) => void;
  page: Page;
  pages: Page[];
  pagesId: string[];
};

const BlockContentEditable = ({
  pagesId,
  pages,
  page,
  block,
  onClickCommentBtn,
}: BlockContendEditableProps) => {
  const { editBlock, addBlock, changeToSub, raiseBlock, deleteBlock } =
    useContext(ActionContext).actions;

  const contentEditableRef = useRef<HTMLElement>(null);
  const [command, setCommand] = useState<string>();
  const [openCommandMenu, setOpenCommandMenu] = useState<boolean>(false);
  const [modalStyle, setModalStyle] = useState<CSSProperties | undefined>();

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
   * value값에 따라 새로운 블록을 생성하거나 기존 block의 content를 수정하는 함수
   */
  const changeBlockContent = useCallback(
    (value: string, targetBlockIndex: number) => {
      if (value.includes("<div>")) {
        //enter 시에 새로운 블록 생성
        const start = value.indexOf("<div>");
        const end = value.indexOf("</div>");
        const editedContents = value.slice(0, start);
        const newContents = value.slice(start + 5, end);
        const newBlock: Block = {
          ...makeNewBlock(page, block, newContents),
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
          addBlock(page.id, newSubToggleBlock, targetBlockIndex + 1, block.id);
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
    },
    [addBlock, editBlock, block, page]
  );
  const changeModalStyle = useCallback(() => {
    const contentEditableDomRect =
      contentEditableRef.current?.getClientRects()[0];
    const frameDomRect = contentEditableRef.current
      ?.closest(".frame")
      ?.getClientRects()[0];
    if (contentEditableDomRect && frameDomRect) {
      const { bottom, top, left } = contentEditableDomRect;
      const GAP = 10;
      const EXTRA_SPACE = 50;
      const isOver = window.innerHeight - bottom < 100;
      const styleBottom = window.innerHeight - top + GAP;
      const styleTop = bottom + GAP;

      const maxHeight = isOver
        ? frameDomRect.top - styleBottom
        : window.innerHeight - styleTop;
      const style: CSSProperties = {
        position: "absolute",
        left: left,
        maxHeight: maxHeight - EXTRA_SPACE,
      };
      isOver
        ? setModalStyle({
            ...style,
            bottom: -window.innerHeight + styleBottom,
          })
        : setModalStyle({
            ...style,
            top: styleTop,
          });
    }
  }, []);
  /**
   * ContentEditable에서 block 의 content을 수정하는 함수 ,
   *  웹 브라우저에서 "/"로 시작하면 block 의 type을 변경할 수 있음
   * @param event ContentEditableEvent
   */
  const onChangeContents = useCallback(
    (event: ContentEditableEvent) => {
      if (page.blocks && page.blocksId) {
        setOriginTemplateItem(page);
        const value = event.target.value;
        const targetBlockIndex = page.blocksId.indexOf(block.id);

        if (!value.startsWith("/")) {
          changeBlockContent(value, targetBlockIndex);
        } else {
          setOpenCommandMenu(true);
          changeModalStyle();
        }
      }
    },
    [block, page, changeBlockContent, changeModalStyle, setOpenCommandMenu]
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
          setOriginTemplateItem(page);
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
          setOriginTemplateItem(page);
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
   * BlockContents 중 link 가 있는 element를 클릭 했을 경우 , 해당 링크를 여는 함수
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
        [...target.classList]
          .filter((i) => i.includes("mainId"))[0]
          .replace("mainId_", "")
      );
      if (onClickCommentBtn) onClickCommentBtn(block);
    },
    [block, onClickCommentBtn]
  );

  const onClickContentEditable = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.className === "link") {
        openLink(target);
        return;
      }
      if (target.classList.contains("text__btn-comment")) {
        openBlockComments(target);
        return;
      }
    },
    [openLink, openBlockComments]
  );

  const closeCommand = useCallback(() => {
    setOpenCommandMenu(false);
    setCommand(undefined);
  }, [setOpenCommandMenu, setCommand]);

  return (
    <>
      {!openCommandMenu ? (
        <ContentEditable
          className="editable"
          placeholder="Type '/' for commands"
          html={blockContents}
          innerRef={contentEditableRef}
          onChange={onChangeContents}
          onKeyDown={onKeyDownContents}
          onClick={onClickContentEditable}
        />
      ) : (
        <>
          <CommandInput
            page={page}
            block={block}
            setCommand={setCommand}
            closeCommand={closeCommand}
          />
          <CommandModal
            page={page}
            block={block}
            command={command}
            openCommandMenu={openCommandMenu}
            style={modalStyle}
            closeCommand={closeCommand}
          />
        </>
      )}
    </>
  );
};

export default React.memo(BlockContentEditable);
