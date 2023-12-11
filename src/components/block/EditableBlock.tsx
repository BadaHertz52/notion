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

import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { MdPlayArrow } from "react-icons/md";

import {
  BlockContents,
  PageIcon,
  BlockComment,
  ScreenOnly,
  ListSub,
} from "../index";

import { ActionContext } from "../../contexts";
import { Block, CommandType, Page, SelectionType } from "../../types";
import {
  changeFontSizeBySmallText,
  findBlock,
  getBlockContentsStyle,
  getEditTime,
  setTemplateItem,
} from "../../utils";
import { SESSION_KEY } from "../../constants";

export type EditableBlockProps = {
  pages: Page[];
  pagesId: string[];
  page: Page;
  block: Block;
  fontSize: number;
  isMoved: MutableRefObject<boolean>;
  setMoveTargetBlock: Dispatch<SetStateAction<Block | null>>;
  pointBlockToMoveBlock: MutableRefObject<Block | null>;
  command: CommandType;
  setCommand: Dispatch<SetStateAction<CommandType>>;
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
  measure?: () => void;
  openExport?: boolean;
};

const EditableBlock = ({
  pages,
  pagesId,
  page,
  block,
  fontSize,
  isMoved,
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
  measure,
  openExport,
}: EditableBlockProps) => {
  const { editBlock } = useContext(ActionContext).actions;
  const className =
    block.type !== "toggle"
      ? `${block.type} block `
      : `${block.type} block ${block.subBlocksId ? "on" : ""}`;
  const subBlocks = block.subBlocksId?.map(
    (id: string) => findBlock(page, id).BLOCK
  );

  const isOpenComments = useMemo(
    () =>
      block.comments ? block.comments.some((i) => i.type === "open") : false,
    [block.comments]
  );

  /**
   * [isMoved] 현재 block을 moveTargetBlock (위치를 변경시킬 block)의 변경된 위치의 기준이 되는 pointBlock으로  지정하는 함수
   * @param event
   * @param targetBlock
   */
  const markPointBlock = useCallback(
    (
      event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
      targetBlock: Block
    ) => {
      if (isMoved.current) {
        pointBlockToMoveBlock.current = targetBlock;
        event.currentTarget.classList.add("on");
      }
    },
    [isMoved, pointBlockToMoveBlock]
  );
  /**
   * [isMoved] 현재 block을  moveTargetBlock (위치를 변경시킬 block)의 위치변경의 기준이 되는 pointBlock 지정을 취소시키는 함수
   * @param event
   */
  const cancelPointBlock = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isMoved.current && pointBlockToMoveBlock.current?.id === block.id) {
        event.currentTarget.classList.remove("on");
      }
    },
    [block.id, isMoved, pointBlockToMoveBlock]
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
      editTime: getEditTime(),
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
    const newBlockItem = sessionStorage.getItem(SESSION_KEY.newBlock);
    if (newBlockItem) {
      const newBlockContentsDoc = document.getElementById(
        `${newBlockItem}__contents`
      );
      if (newBlockContentsDoc) {
        const newBlockContentEditableDoc =
          newBlockContentsDoc.firstElementChild as HTMLElement;
        newBlockContentEditableDoc.focus();
      }
      sessionStorage.removeItem(SESSION_KEY.newBlock);
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
              onClickCommentBtn={onClickCommentBtn}
              subBlocks={subBlocks}
              isOpenComments={isOpenComments}
              markPointBlock={markPointBlock}
              cancelPointBlock={cancelPointBlock}
              measure={measure}
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
                        openExport={openExport}
                      />
                    </div>
                  )}
                  <div
                    className="block__contents"
                    style={getBlockContentsStyle(block)}
                  >
                    <BlockContents {...props} />
                  </div>
                </div>
                {isOpenComments && (
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
                      measure={measure}
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
