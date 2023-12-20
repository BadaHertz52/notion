import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { FcTodoList } from "react-icons/fc";
import { IoIosList } from "react-icons/io";
import { IoDocumentTextOutline, IoTextOutline } from "react-icons/io5";
import { RiPlayList2Fill } from "react-icons/ri";
import { VscListOrdered } from "react-icons/vsc";

import { Img } from "../index";
import { ActionContext } from "../../contexts";
import { Block, BlockType, Page, SelectionType } from "../../types";
import {
  makeNewBlock,
  findParentBlock,
  setTemplateItem,
  getEditTime,
} from "../../utils";

import imgIcon from "../../assets/img/vincent-van-gogh-ge1323790d_640.webp";
import "../../assets/commandMenu.scss";

export type CommandMenuProp = {
  page: Page;
  block: Block;
  // CommandInput을 통해 타입 변경을 하는 경우에 command 값 있음
  command?: string;
  closeCommand: () => void;
  setSelection?: Dispatch<SetStateAction<SelectionType | null>>;
};
const CommandMenu = ({
  page,
  block,
  command,
  setSelection,
  closeCommand,
}: CommandMenuProp) => {
  const { editBlock, changeBlockToPage, changePageToBlock, editPage } =
    useContext(ActionContext).actions;
  const imgSrc = imgIcon + "?&width=36$height=36";

  const [noResult, setNoResult] = useState<boolean>(true);
  const getBtnClass = useCallback(
    (name: string, command: string | undefined) => {
      const BASE_NAME = "btn-command";
      const ON = "on";
      const classList = [BASE_NAME];
      if (!command || name.includes(command)) classList.push(ON);

      return classList.join(" ");
    },
    []
  );
  /**
   * block의 type 을 numberList 나 bulletList로 바꾸는 함수
   * @param editedBlock
   */
  const changeToListType = useCallback(
    (editedBlock: Block, parentBlockType: BlockType) => {
      const editTime = getEditTime();

      if (page.firstBlocksId && page.blocks && page.blocksId) {
        const firstBlocksId = [...page.firstBlocksId];
        const blocks = [...page.blocks];
        const blocksId = [...page.blocksId];
        const indexOfBlocks = blocksId.indexOf(editedBlock.id);

        const newBlock = makeNewBlock(page, editedBlock);
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
                const newBlock = makeNewBlock(page, parentBlock);
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
              editTime: editTime,
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
          editTime: editTime,
        };
        editPage(page.id, editedPage);
      }
    },
    [editPage, page]
  );
  const closeCommandMenu = useCallback(() => {
    closeCommand && closeCommand();
  }, [closeCommand]);

  const changeType = useCallback(
    (blockType: BlockType) => {
      const templateHtml = document.getElementById("template");
      setTemplateItem(templateHtml, page);
      if (block.type !== blockType) {
        const editedBlock: Block = {
          ...block,
          editTime: getEditTime(),
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
      closeCommandMenu();
      setSelection && setSelection(null);
    },
    [
      block,
      editBlock,
      setSelection,
      changeBlockToPage,
      changePageToBlock,
      changeToListType,
      closeCommandMenu,
      page,
    ]
  );
  const onClickImgTypeBtn = useCallback(() => {
    changeType("image");
    closeCommandMenu();
  }, [changeType, closeCommandMenu]);

  useEffect(() => {
    setNoResult(!document.querySelectorAll(".btn-command.on")[0]);
  }, [command]);

  return (
    <div id="commandMenu">
      <div className="inner">
        <div className="command type-basic">
          <header className="command__header">BASIC BLOCKS</header>
          <div className="command__btn-group type">
            <button
              onClick={() => changeType("text")}
              className={getBtnClass("text", command)}
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
              className={getBtnClass("page", command)}
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
              className={getBtnClass("todo", command)}
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
              className={getBtnClass("h1", command)}
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
              className={getBtnClass("h2", command)}
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
              className={getBtnClass("h3", command)}
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
              className={getBtnClass("bullet list", command)}
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
              className={getBtnClass("number list", command)}
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
              className={getBtnClass("toggle list", command)}
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
            <button
              className={getBtnClass("image photo", command)}
              onClick={onClickImgTypeBtn}
              name="image"
            >
              <div className="btn-command__inner">
                <div className="btn-command__left">
                  <Img src={imgSrc} alt="imgIcon" />
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
      {noResult && (
        <div className="no-result" id="commandMenu__noResult">
          No results
        </div>
      )}
    </div>
  );
};

export default React.memo(CommandMenu);
