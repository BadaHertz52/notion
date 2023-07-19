import React, {
  CSSProperties,
  Dispatch,
  MouseEvent,
  MutableRefObject,
  SetStateAction,
  TouchEvent,
  useEffect,
  useRef,
  useContext,
} from "react";
import { Block, MainCommentType, findBlock, Page } from "../modules/notion";
import { Command } from "./Frame";
import { ActionContext, selectionType } from "../containers/NotionRouter";
import BlockComponent from "./BlockComponent";
import { setTemplateItem } from "../fn";
import { GoPrimitiveDot } from "react-icons/go";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { MdPlayArrow } from "react-icons/md";
import PageIcon from "./PageIcon";
import BlockComment from "./BlockComment";
import ScreenOnly from "./ScreenOnly";
export type EditableBlockProps = {
  pages: Page[];
  pagesId: string[];
  page: Page;
  block: Block;
  fontSize: number;
  moveBlock: MutableRefObject<boolean>;
  setMoveTargetBlock: Dispatch<SetStateAction<Block | null>>;
  pointBlockToMoveBlock: MutableRefObject<Block | null>;
  command: Command;
  setCommand: Dispatch<SetStateAction<Command>>;
  setTargetPageId: Dispatch<SetStateAction<string>>;
  openComment: boolean;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  setCommentBlock: Dispatch<SetStateAction<Block | null>>;
  setOpenLoader: Dispatch<SetStateAction<boolean>>;
  setLoaderTargetBlock: Dispatch<SetStateAction<Block | null>>;
  closeMenu: (event: globalThis.MouseEvent | MouseEvent) => void;
  templateHtml: HTMLElement | null;
  setSelection: Dispatch<SetStateAction<selectionType | null>>;
  mobileMenuTargetBlock: Block | null;
  setMobileMenuTargetBlock: Dispatch<SetStateAction<Block | null>>;
};
export type CommentOpenType = {
  open: boolean;
  targetId: string | null;
};
export const changeFontSizeBySmallText = (
  block: Block,
  fontSize: number
): CSSProperties => {
  const baseSize = fontSize;
  let ratio = 1;
  switch (block.type) {
    case "h1":
      window.innerWidth >= 768 ? (ratio = 2.5) : (ratio = 2);
      break;
    case "h2":
      window.innerWidth >= 768 ? (ratio = 2.2) : (ratio = 1.6);
      break;
    case "h3":
      window.innerWidth >= 768 ? (ratio = 2) : (ratio = 1.3);
      break;
    default:
      break;
  }
  const style: CSSProperties = {
    fontSize: `${baseSize * ratio}rem`,
  };
  return style;
};

const EditableBlock = ({
  pages,
  pagesId,
  page,
  block,
  fontSize,
  moveBlock,
  setMoveTargetBlock,
  pointBlockToMoveBlock,
  command,
  setCommand,
  openComment,
  setTargetPageId,
  setOpenComment,
  setCommentBlock,
  setOpenLoader,
  setLoaderTargetBlock,
  closeMenu,
  templateHtml,
  setSelection,
  setMobileMenuTargetBlock,
  mobileMenuTargetBlock,
}: EditableBlockProps) => {
  const { editBlock } = useContext(ActionContext).actions;
  const className =
    block.type !== "toggle"
      ? `${block.type} block `
      : `${block.type} block ${block.subBlocksId ? "on" : ""}`;
  const subBlocks = block.subBlocksId?.map(
    (id: string) => findBlock(page, id).BLOCK
  );

  const showBlockComment = block.comments
    ? block.comments.some((i) => i.type === "open")
    : false;

  const blockContentsStyle = (block: Block): CSSProperties => {
    return {
      color: block.type !== "todo_done" ? block.style.color : "grey",
      backgroundColor: block.style.bgColor,
      width: block.style.width === undefined ? "inherit" : block.style.width,
      height: block.style.height === undefined ? "inherit" : block.style.height,
    };
  };
  /**
   * [moveBlock] 현재 block을 moveTargetBlock (위치를 변경시킬 block)의 변경된 위치의 기준이 되는 pointBlock으로  지정하는 함수
   * @param event
   * @param targetBlock
   */
  const markPointBlock = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
    targetBlock: Block
  ) => {
    if (moveBlock.current) {
      pointBlockToMoveBlock.current = targetBlock;
      event.currentTarget.classList.add("on");
    }
  };
  /**
   * [moveBlock] 현재 block을  moveTargetBlock (위치를 변경시킬 block)의 위치변경의 기준이 되는 pointBlock 지정을 취소시키는 함수
   * @param event
   */
  const cancelPointBlock = (event: MouseEvent<HTMLDivElement>) => {
    if (moveBlock.current && pointBlockToMoveBlock.current?.id === block.id) {
      event.currentTarget.classList.remove("on");
    }
  };
  const onClickCommentBtn = (block: Block) => {
    if (!openComment) {
      setCommentBlock(block);
      setOpenComment(true);
    }
  };
  const onClickTodoBtn = () => {
    const editedBlock: Block = {
      ...block,
      type: block.type === "todo" ? "todo_done" : "todo",
      editTime: JSON.stringify(Date.now()),
    };
    setTemplateItem(templateHtml, page);
    editBlock(page.id, editedBlock);
  };
  const onClickToggle = (event: React.MouseEvent) => {
    const target = event.currentTarget;
    const blockId = target.getAttribute("name");
    const toggleMainDoc = document.getElementById(`block-${blockId}`);
    target.classList.toggle("on");
    toggleMainDoc?.classList.toggle("on");
  };

  useEffect(() => {
    const newBlockItem = sessionStorage.getItem("newBlock");
    if (newBlockItem) {
      const newBlockContentsDoc = document.getElementById(
        `${newBlockItem}__contents`
      );
      if (newBlockContentsDoc) {
        const newBlockContentEditableDoc =
          newBlockContentsDoc.firstElementChild as HTMLElement;
        newBlockContentEditableDoc.focus();
      }
      sessionStorage.removeItem("newBlock");
    }
    if (block.type.includes("media") && block.contents === "") {
      setOpenLoader(true);
      setLoaderTargetBlock(block);
    }
  }, [block, setLoaderTargetBlock, setOpenLoader]);

  const ListSub = () => {
    const blockContentsRef = useRef<HTMLDivElement>(null);
    const getListMarker = (subBlock: Block) => {
      let listMarker: string = "";
      const listSubBlocksId = block.subBlocksId;

      if (listSubBlocksId) {
        const listSubBlocks = listSubBlocksId.map(
          (id: string) => findBlock(page, id).BLOCK
        );
        // const alphabetArr = Array.from({ length: 26 }, (v, i) => String.fromCharCode(i + 65));
        const numberArr = Array.from({ length: 9 }, (v, i) => i + 1);
        const subBlockIndex = listSubBlocksId.indexOf(subBlock.id) as number;
        if (subBlockIndex === 0) {
          listMarker = "1";
        } else {
          const previousSubBlock = listSubBlocks[subBlockIndex - 1];
          if (previousSubBlock.type === "numberList") {
            const slicedSubBlocks = listSubBlocks.slice(0, subBlockIndex); // 0~ previous block 까지
            const filteredSubBlocks = slicedSubBlocks.filter(
              (block: Block) => (block.type = "numberList")
            );
            listMarker = numberArr[filteredSubBlocks.length].toString();
          } else {
            listMarker = "1";
          }
        }
      }
      return listMarker;
    };
    const listStyle = (block: Block): CSSProperties => {
      return {
        textDecoration: "none",
        fontStyle: "normal",
        fontWeight: "normal",
        backgroundColor: block.style.bgColor,
        color: block.style.color,
      };
    };
    return (
      <>
        {subBlocks &&
          subBlocks[0] &&
          subBlocks.map((block: Block, i) => (
            <div className="listItem" key={`listItem_${i}`}>
              <div
                className="mainBlock"
                key={`listItem_${subBlocks.indexOf(block)}`}
                onMouseOver={(event) => markPointBlock(event, block)}
                onMouseLeave={(event) => cancelPointBlock(event)}
              >
                <div className="mainBlock__block">
                  <div
                    id={`block-${block.id}`}
                    className="block__contents"
                    ref={blockContentsRef}
                    style={listStyle(block)}
                  >
                    {block.type.includes("List") && (
                      <div className="listItem-marker">
                        {block.type.includes("number") ? (
                          `${getListMarker(block)}.`
                        ) : (
                          <GoPrimitiveDot />
                        )}
                      </div>
                    )}
                    <BlockComponent
                      block={block}
                      page={page}
                      pages={pages}
                      pagesId={pagesId}
                      command={command}
                      setCommand={setCommand}
                      setOpenComment={setOpenComment}
                      setTargetPageId={setTargetPageId}
                      setOpenLoader={setOpenLoader}
                      setLoaderTargetBlock={setLoaderTargetBlock}
                      closeMenu={closeMenu}
                      templateHtml={templateHtml}
                      setSelection={setSelection}
                      setMobileMenuTargetBlock={setMobileMenuTargetBlock}
                      onClickCommentBtn={onClickCommentBtn}
                      moveBlock={moveBlock}
                      setMoveTargetBlock={setMoveTargetBlock}
                    />
                  </div>
                </div>
                {showBlockComment && (
                  <BlockComment
                    block={block}
                    onClickCommentBtn={onClickCommentBtn}
                  />
                )}
              </div>
              {block.subBlocksId && (
                <div className="subBlock-group">
                  {block.subBlocksId
                    .map((id: string) => findBlock(page, id).BLOCK)
                    .map((sub: Block) => (
                      <EditableBlock
                        key={block.subBlocksId?.indexOf(sub.id)}
                        pages={pages}
                        pagesId={pagesId}
                        page={page}
                        block={sub}
                        fontSize={fontSize}
                        moveBlock={moveBlock}
                        setMoveTargetBlock={setMoveTargetBlock}
                        pointBlockToMoveBlock={pointBlockToMoveBlock}
                        command={command}
                        setCommand={setCommand}
                        openComment={openComment}
                        setOpenComment={setOpenComment}
                        setCommentBlock={setCommentBlock}
                        setTargetPageId={setTargetPageId}
                        setOpenLoader={setOpenLoader}
                        setLoaderTargetBlock={setLoaderTargetBlock}
                        closeMenu={closeMenu}
                        templateHtml={templateHtml}
                        setSelection={setSelection}
                        setMobileMenuTargetBlock={setMobileMenuTargetBlock}
                        mobileMenuTargetBlock={mobileMenuTargetBlock}
                      />
                    ))}
                </div>
              )}
            </div>
          ))}
      </>
    );
  };
  return (
    <div className="editableBlock">
      <div className="inner">
        <div
          id={`block-${block.id}`}
          className={className}
          style={changeFontSizeBySmallText(block, fontSize)}
        >
          {block.type.includes("ListArr") ? (
            <ListSub />
          ) : (
            <>
              <div
                className="mainBlock"
                onMouseOver={(event) => markPointBlock(event, block)}
                onMouseLeave={(event) => cancelPointBlock(event)}
              >
                <div className="mainBlock__block">
                  {block.type === "todo" && (
                    <button
                      title="button to check"
                      className="checkbox left block__btn"
                      name={block.id}
                      onClick={onClickTodoBtn}
                    >
                      <ScreenOnly text="button to check" />
                      <GrCheckbox className="block__btn__svg" />
                    </button>
                  )}
                  {block.type === "todo_done" && (
                    <button
                      title="button to uncheck"
                      className="checkbox done left block__btn"
                      name={block.id}
                      onClick={onClickTodoBtn}
                    >
                      <ScreenOnly text="button to uncheck" />
                      <GrCheckboxSelected className="block__btn__svg " />
                    </button>
                  )}
                  {block.type === "toggle" && (
                    <button
                      title="button to toggle"
                      name={block.id}
                      onClick={onClickToggle}
                      className={
                        block.subBlocksId
                          ? "blockToggleBtn on left block__btn"
                          : "blockToggleBtn left block__btn"
                      }
                    >
                      <ScreenOnly text="button to toggle" />
                      <MdPlayArrow className="block__btn__svg" />
                    </button>
                  )}
                  {block.type === "page" && (
                    <div className="page__icon-outBox left">
                      <PageIcon
                        icon={block.icon}
                        iconType={block.iconType}
                        style={undefined}
                      />
                    </div>
                  )}
                  <div
                    className="block__contents"
                    style={blockContentsStyle(block)}
                  >
                    <BlockComponent
                      pages={pages}
                      pagesId={pagesId}
                      block={block}
                      page={page}
                      command={command}
                      setCommand={setCommand}
                      setTargetPageId={setTargetPageId}
                      setOpenComment={setOpenComment}
                      setOpenLoader={setOpenLoader}
                      setLoaderTargetBlock={setLoaderTargetBlock}
                      closeMenu={closeMenu}
                      templateHtml={templateHtml}
                      setSelection={setSelection}
                      setMobileMenuTargetBlock={setMobileMenuTargetBlock}
                      onClickCommentBtn={onClickCommentBtn}
                      moveBlock={moveBlock}
                      setMoveTargetBlock={setMoveTargetBlock}
                    />
                  </div>
                </div>
                {showBlockComment && (
                  <BlockComment
                    block={block}
                    onClickCommentBtn={onClickCommentBtn}
                  />
                )}
              </div>
              {subBlocks && subBlocks[0] && (
                <div className="subBlock-group">
                  {subBlocks.map((subBlock: Block) => (
                    <EditableBlock
                      key={subBlocks.indexOf(subBlock)}
                      pages={pages}
                      pagesId={pagesId}
                      page={page}
                      block={subBlock}
                      fontSize={fontSize}
                      moveBlock={moveBlock}
                      setMoveTargetBlock={setMoveTargetBlock}
                      pointBlockToMoveBlock={pointBlockToMoveBlock}
                      command={command}
                      setCommand={setCommand}
                      openComment={openComment}
                      setOpenComment={setOpenComment}
                      setCommentBlock={setCommentBlock}
                      setTargetPageId={setTargetPageId}
                      setOpenLoader={setOpenLoader}
                      setLoaderTargetBlock={setLoaderTargetBlock}
                      closeMenu={closeMenu}
                      templateHtml={templateHtml}
                      setSelection={setSelection}
                      setMobileMenuTargetBlock={setMobileMenuTargetBlock}
                      mobileMenuTargetBlock={mobileMenuTargetBlock}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableBlock;
