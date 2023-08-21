import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { FcTodoList } from "react-icons/fc";
import { IoIosList } from "react-icons/io";
import { IoDocumentTextOutline, IoTextOutline } from "react-icons/io5";
import { RiPlayList2Fill } from "react-icons/ri";
import { VscListOrdered } from "react-icons/vsc";
import { Command } from "./Frame";
import { ActionContext, SelectionType } from "../route/NotionRouter";
import { Block, BlockType, Page } from "../modules/notion/type";
import { makeNewBlock, findParentBlock, setTemplateItem } from "../fn/index";
import imgIcon from "../assets/img/vincent-van-gogh-ge1323790d_640.jpeg";
import { CSSProperties } from "styled-components";
import "../assets/commandBlock.scss";
type CommandBlockProp = {
  page: Page;
  block: Block;
  command: Command | null;
  setCommand: Dispatch<SetStateAction<Command>> | null;
  closeCommand?: () => void;
  setSelection: Dispatch<SetStateAction<SelectionType | null>> | null;
  style: CSSProperties | undefined;
};
const CommandBlock = ({
  page,
  block,
  setCommand,
  command,
  setSelection,
  closeCommand,
  style,
}: CommandBlockProp) => {
  const { editBlock, changeBlockToPage, changePageToBlock, editPage } =
    useContext(ActionContext).actions;
  const noResultRef = useRef<HTMLDivElement>(null);
  const btnGroupRef = useRef<HTMLDivElement>(null);
  const showResult = useCallback(() => {
    const btnArr = [...document.getElementsByClassName("btn-command")];
    if (command) {
      const typeCommand = command.command?.slice(1);
      typeCommand &&
        btnArr.forEach((btn: Element) => {
          const name = btn.getAttribute("name");
          if (name?.includes(typeCommand)) {
            btn.setAttribute("class", "btn-command on");
          } else {
            btn.setAttribute("class", "btn-command");
          }
        });
      const onBlocks = document.querySelectorAll(".btn-command.on");
      if (onBlocks[0] === undefined) {
        noResultRef.current?.setAttribute("style", "display:block");
        btnGroupRef.current?.setAttribute("style", "display:none");
      } else {
        onBlocks[0].classList.add("first");
        btnGroupRef.current?.setAttribute("style", "display:block");
        noResultRef.current?.setAttribute("style", "display:none");
      }
    } else {
      btnArr.forEach((btn) => btn.setAttribute("class", "btn-command on"));
    }
  }, [command, btnGroupRef, noResultRef]);
  /**
   * block의 type 을 numberList 나 bulletList로 바꾸는 함수
   * @param editedBlock
   */
  const changeToListType = useCallback(
    (editedBlock: Block, parentBlockType: BlockType) => {
      if (page.firstBlocksId && page.blocks && page.blocksId) {
        const firstBlocksId = [...page.firstBlocksId];
        const blocks = [...page.blocks];
        const blocksId = [...page.blocksId];
        const indexOfBlocks = blocksId.indexOf(editedBlock.id);

        const newBlock = makeNewBlock(page, editedBlock, "");
        const newParentBlock: Block = {
          ...newBlock,
          type: parentBlockType,
          subBlocksId: [editedBlock.id],
        };
        const listBlock: Block = {
          ...editedBlock,
          firstBlock: false,
          parentBlocksId: newParentBlock.parentBlocksId
            ? newParentBlock.parentBlocksId.concat(newParentBlock.id)
            : [newParentBlock.id],
        };
        //listBlock data 수정
        blocks.splice(indexOfBlocks, 1, listBlock);
        // newParent 를 blocks에 추가
        if (editedBlock.parentBlocksId) {
          //editedBlock is not firstBlock
          const { parentBlock, parentBlockIndex } = findParentBlock(
            page,
            editedBlock
          );
          const subBlocksId = [...(parentBlock.subBlocksId as string[])];
          const index = subBlocksId.indexOf(editedBlock.id);
          const editTime = JSON.stringify(Date.now());

          if (parentBlock.type.includes("Arr")) {
            const updatedNewParentBlock: Block = {
              ...newParentBlock,
              parentBlocksId: parentBlock.parentBlocksId,
              firstBlock: parentBlock.firstBlock,
            };
            const updatedListBlock: Block = {
              ...listBlock,
              parentBlocksId:
                updatedNewParentBlock.parentBlocksId === null
                  ? [updatedNewParentBlock.id]
                  : updatedNewParentBlock.parentBlocksId.concat(
                      updatedNewParentBlock.id
                    ),
            };
            blocks.splice(indexOfBlocks, 1, updatedListBlock);

            if (parentBlock.firstBlock) {
              const indexAsFirst = firstBlocksId.indexOf(parentBlock.id);
              firstBlocksId.splice(
                indexAsFirst + 1,
                0,
                updatedNewParentBlock.id
              );
            }
            //block의 subBlock으로의 위치에 따라 newParentBlock의 data나 위치가 달라짐
            if (index === 0) {
              blocks.splice(parentBlockIndex, 1, updatedNewParentBlock);
              blocksId.splice(parentBlockIndex, 1, updatedNewParentBlock.id);
            } else {
              blocks.splice(indexOfBlocks, 0, updatedNewParentBlock);
              blocksId.splice(indexOfBlocks, 0, updatedNewParentBlock.id);

              if (index === subBlocksId.length - 1) {
                subBlocksId.splice(index, 1);
                const editedParentBlock: Block = {
                  ...parentBlock,
                  subBlocksId: subBlocksId,
                  editTime: editTime,
                };
                blocks.splice(parentBlockIndex, 1, editedParentBlock);
              } else {
                const preSubBlocksId = subBlocksId.slice(0, index);
                const afterSubBlocksId = subBlocksId.slice(index + 1);

                const editedParentBlock: Block = {
                  ...parentBlock,
                  subBlocksId: preSubBlocksId,
                  editTime: editTime,
                };
                blocks.splice(parentBlockIndex, 1, editedParentBlock);
                const newBlock = makeNewBlock(page, parentBlock, "");
                const newAfterArrBlock: Block = {
                  ...newBlock,
                  id: `${page.id}_${editTime}(1)`,
                  subBlocksId: afterSubBlocksId,
                };
                blocks.splice(indexOfBlocks + 2, 0, newAfterArrBlock);
                blocksId.splice(indexOfBlocks + 2, 0, newAfterArrBlock.id);
                if (parentBlock.firstBlock) {
                  const indexAsFirst = firstBlocksId.indexOf(parentBlock.id);
                  firstBlocksId.splice(
                    indexAsFirst + 2,
                    0,
                    newAfterArrBlock.id
                  );
                }
              }
            }
          } else {
            // parentBlock의 subBlocks 중 block을 newParentBlock으로 바꿈
            subBlocksId.splice(index, 1, newParentBlock.id);
            const editedParentBlock: Block = {
              ...parentBlock,
              subBlocksId: subBlocksId,
              editTime: JSON.stringify(Date.now()),
            };
            blocks.splice(parentBlockIndex, 1, editedParentBlock);

            const editedNewParentBlock: Block = {
              ...newParentBlock,
              parentBlocksId: editedParentBlock.parentBlocksId
                ? editedParentBlock.parentBlocksId.concat(editedParentBlock.id)
                : [editedParentBlock.id],
            };
            blocks.splice(indexOfBlocks, 0, editedNewParentBlock);
            blocksId.splice(indexOfBlocks, 0, editedNewParentBlock.id);
            const editedListBlock: Block = {
              ...listBlock,
              parentBlocksId: editedNewParentBlock.parentBlocksId
                ? editedNewParentBlock.parentBlocksId.concat(
                    editedNewParentBlock.id
                  )
                : [editedNewParentBlock.id],
            };
            blocks.splice(indexOfBlocks, 1, editedListBlock);
          }
        } else {
          const indexOfBlockAsFirstBlock = firstBlocksId.indexOf(
            editedBlock.id
          );
          firstBlocksId.splice(indexOfBlockAsFirstBlock, 1, newParentBlock.id);
          blocks.splice(indexOfBlocks, 0, newParentBlock);
          blocksId.splice(indexOfBlocks, 0, newParentBlock.id);
        }
        const editedPage: Page = {
          ...page,
          firstBlocksId: firstBlocksId,
          blocks: blocks,
          blocksId: blocksId,
          editTime: JSON.stringify(Date.now()),
        };
        editPage(page.id, editedPage);
      }
    },
    [editPage, page]
  );
  const closeCommandBlock = useCallback(() => {
    setCommand &&
      setCommand({
        open: false,
        command: null,
        targetBlock: null,
      });

    closeCommand && closeCommand();
  }, [setCommand, closeCommand]);
  const changeType = useCallback(
    (blockType: BlockType) => {
      const templateHtml = document.getElementById("template");
      setTemplateItem(templateHtml, page);
      if (block.type !== blockType) {
        const editedBlock: Block = {
          ...block,
          editTime: JSON.stringify(Date.now()),
          type:
            blockType === "bulletListArr"
              ? "bulletList"
              : blockType === "numberListArr"
              ? "numberList"
              : blockType,
          contents: blockType === "image" ? "" : block.contents,
        };
        switch (blockType) {
          case "page":
            changeBlockToPage(page.id, block);
            break;
          case "numberListArr":
            changeToListType(editedBlock, "numberListArr");
            break;
          case "bulletListArr":
            changeToListType(editedBlock, "bulletListArr");
            break;
          default:
            block.type === "page"
              ? changePageToBlock(page.id, editedBlock)
              : editBlock(page.id, editedBlock);
            break;
        }
      }
      closeCommandBlock();
      setSelection && setSelection(null);
    },
    [
      block,
      editBlock,
      setSelection,
      changeBlockToPage,
      changePageToBlock,
      changeToListType,
      closeCommandBlock,
      page,
    ]
  );
  const onClickImgTypeBtn = useCallback(() => {
    changeType("image");
    closeCommandBlock();
  }, [changeType, closeCommandBlock]);

  useEffect(() => {
    showResult();
  }, [command, showResult]);
  return (
    <div id="commandBlock" style={style}>
      <div className="inner">
        <div className="command type-basic">
          <header className="command__header">BASIC BLOCKS</header>
          <div className="command__btn-group type" ref={btnGroupRef}>
            <button
              onClick={() => changeType("text")}
              className="btn-command on"
              name="text"
            >
              <div className="btn-command__inner">
                <div className="btn-command__left">
                  <IoTextOutline />
                </div>
                <div className="btn-command__right">
                  <header>Text</header>
                  <div className="command__explanation">
                    Just start writing with plain text.
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={() => changeType("page")}
              className="btn-command on "
              name="page"
            >
              <div className="btn-command__inner">
                <div className="btn-command__left">
                  <IoDocumentTextOutline />
                </div>
                <div className="btn-command__right">
                  <header>Page</header>
                  <div className="command__explanation">
                    Embed a sub-page inside this page.
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={() => changeType("todo")}
              className="btn-command on"
              name="todo list"
            >
              <div className="btn-command__inner">
                <div className="btn-command__left">
                  <FcTodoList />
                </div>
                <div className="btn-command__right">
                  <header>To-do list</header>
                  <div className="command__explanation">
                    Track tasks width a to-do list.
                  </div>
                </div>
              </div>
            </button>
            <button
              className="btn-command on"
              onClick={() => changeType("h1")}
              name="h1 heading 1"
            >
              <div className="btn-command__inner">
                <div className="btn-command__left headerType">
                  <span>H</span>
                  <span>1</span>
                </div>
                <div className="btn-command__right">
                  <header>Heading 1</header>
                  <div className="command__explanation">
                    Big section heading.
                  </div>
                </div>
              </div>
            </button>
            <button
              className="btn-command on"
              onClick={() => changeType("h2")}
              name="h2 heading 2"
            >
              <div className="btn-command__inner">
                <div className="btn-command__left headerType">
                  <span>H</span>
                  <span>2</span>
                </div>
                <div className="btn-command__right ">
                  <header>Heading 2</header>
                  <div className="command__explanation">
                    Medium section heading
                  </div>
                </div>
              </div>
            </button>
            <button
              className="btn-command on"
              onClick={() => changeType("h3")}
              name="h3 heading 3"
            >
              <div className="btn-command__inner">
                <div className="btn-command__left headerType">
                  <span>H</span>
                  <span>3</span>
                </div>
                <div className="btn-command__right">
                  <header>Heading 3</header>
                  <div className="command__explanation">
                    Small section heading.
                  </div>
                </div>
              </div>
            </button>
            <button
              className="btn-command on"
              onClick={() => changeType("bulletListArr")}
              name="bullet list"
            >
              <div className="btn-command__inner">
                <div className="btn-command__left">
                  <IoIosList />
                </div>
                <div className="btn-command__right">
                  <header>Bullet list</header>
                  <div className="command__explanation">
                    Create a simple bullet list.
                  </div>
                </div>
              </div>
            </button>
            <button
              className="btn-command on"
              onClick={() => changeType("numberListArr")}
              name="number list"
            >
              <div className="btn-command__inner">
                <div className="btn-command__left">
                  <VscListOrdered />
                </div>
                <div className="btn-command__right">
                  <header>Numbered list</header>
                  <div className="command__explanation">
                    Create a list with numbering.
                  </div>
                </div>
              </div>
            </button>
            <button
              className="btn-command on"
              onClick={() => changeType("toggle")}
              name="toggle list"
            >
              <div className="btn-command__inner">
                <div className="btn-command__left">
                  <RiPlayList2Fill />
                </div>
                <div className="btn-command__right">
                  <header>Toggle list</header>
                  <div className="command__explanation">
                    Toggles can hide and show content inside
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="command type-media">
          <header className="command__header">MEDIA</header>
          <div className="command__btn-group type">
            <button
              className="btn-command on"
              onClick={onClickImgTypeBtn}
              name="image"
            >
              <div className="btn-command__inner">
                <div className="btn-command__left">
                  <img src={imgIcon} alt="imgIcon" loading="lazy" />
                </div>
                <div className="btn-command__right">
                  <header>Image</header>
                  <div className="command__explanation">
                    Upload or embed width a link
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="no-result" id="commandBlock-noResult" ref={noResultRef}>
        No results
      </div>
    </div>
  );
};

export default CommandBlock;
