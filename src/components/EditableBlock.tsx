import React, {
  CSSProperties,
  Dispatch,
  MouseEvent,
  MutableRefObject,
  SetStateAction,
  TouchEvent,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { Block, Page } from "../modules/notion/type";
import { findBlock, setTemplateItem } from "../fn";
import { Command } from "./Frame";
import { ActionContext, SelectionType } from "../containers/NotionRouter";
import BlockComponent from "./BlockComponent";

import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { MdPlayArrow } from "react-icons/md";
import PageIcon from "./PageIcon";
import BlockComment from "./BlockComment";
import ScreenOnly from "./ScreenOnly";
import ListSub from "./ListSub";
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
  openComment: boolean;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  setCommentBlock: Dispatch<SetStateAction<Block | null>>;
  setOpenLoader: Dispatch<SetStateAction<boolean>>;
  setLoaderTargetBlock: Dispatch<SetStateAction<Block | null>>;
  closeMenu: (event: globalThis.MouseEvent | MouseEvent) => void;
  templateHtml: HTMLElement | null;
  setSelection: Dispatch<SetStateAction<SelectionType | null>>;
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

  const showBlockComment = useMemo(
    () =>
      block.comments ? block.comments.some((i) => i.type === "open") : false,
    [block.comments]
  );
  const blockContentsStyle = useCallback((block: Block): CSSProperties => {
    return {
      color: block.type !== "todo_done" ? block.style.color : "grey",
      backgroundColor: block.style.bgColor,
      width: block.style.width === undefined ? "inherit" : block.style.width,
      height: block.style.height === undefined ? "inherit" : block.style.height,
    };
  }, []);
  /**
   * [moveBlock] 현재 block을 moveTargetBlock (위치를 변경시킬 block)의 변경된 위치의 기준이 되는 pointBlock으로  지정하는 함수
   * @param event
   * @param targetBlock
   */
  const markPointBlock = useCallback(
    (
      event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
      targetBlock: Block
    ) => {
      if (moveBlock.current) {
        pointBlockToMoveBlock.current = targetBlock;
        event.currentTarget.classList.add("on");
      }
    },
    [moveBlock, pointBlockToMoveBlock]
  );
  /**
   * [moveBlock] 현재 block을  moveTargetBlock (위치를 변경시킬 block)의 위치변경의 기준이 되는 pointBlock 지정을 취소시키는 함수
   * @param event
   */
  const cancelPointBlock = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (moveBlock.current && pointBlockToMoveBlock.current?.id === block.id) {
        event.currentTarget.classList.remove("on");
      }
    },
    [block.id, moveBlock, pointBlockToMoveBlock]
  );
  const onClickCommentBtn = useCallback(
    (block: Block) => {
      if (!openComment) {
        setCommentBlock(block);
        setOpenComment(true);
      }
    },
    [openComment, setCommentBlock, setOpenComment]
  );

  const onClickTodoBtn = useCallback(() => {
    const editedBlock: Block = {
      ...block,
      type: block.type === "todo" ? "todo_done" : "todo",
      editTime: JSON.stringify(Date.now()),
    };
    setTemplateItem(templateHtml, page);
    editBlock(page.id, editedBlock);
  }, [block, editBlock, templateHtml, page]);

  const onClickToggle = useCallback((event: React.MouseEvent) => {
    const target = event.currentTarget;
    const blockId = target.getAttribute("name");
    const toggleMainDoc = document.getElementById(`block-${blockId}`);
    target.classList.toggle("on");
    toggleMainDoc?.classList.toggle("on");
  }, []);

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

  return (
    <div className="editableBlock">
      <div className="inner">
        <div
          id={`block-${block.id}`}
          className={className}
          style={changeFontSizeBySmallText(block, fontSize)}
        >
          {block.type.includes("ListArr") ? (
            <ListSub
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
              onClickCommentBtn={onClickCommentBtn}
              subBlocks={subBlocks}
              showBlockComment={showBlockComment}
              markPointBlock={markPointBlock}
              cancelPointBlock={cancelPointBlock}
            />
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
