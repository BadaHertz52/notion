import React, {
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
  setMovingTargetBlock?: Dispatch<SetStateAction<Block | null>>;
  onClickCommentBtn?: (block: Block) => void;
  templateHtml: HTMLElement | null;
  setSelection?: Dispatch<SetStateAction<SelectionType | null>>;
  mobileMenuTargetBlock?: Block | null;
  setMobileMenuTargetBlock?: Dispatch<SetStateAction<Block | null>>;
  measure?: () => void;
  openExport?: boolean;
};

const EditableBlock = ({ ...props }: EditableBlockProps) => {
  const { block, page, templateHtml } = props;
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
      block.comments
        ? block.comments.some((comment) => comment.type === "open")
        : false,
    [block.comments]
  );
  const isMovingBlock = useCallback(
    () => !!document.querySelector("#movingTargetBlock"),
    []
  );
  /**
   * [isMoved] 현재 block을 movingTargetBlock (위치를 변경시킬 block)의 변경된 위치의 기준이 되는 pointBlock으로  지정하는 함수
   * @param event
   * @param targetBlock
   */
  const markPointBlock = useCallback(
    (event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
      if (isMovingBlock()) {
        event.currentTarget.classList.add("on");
      }
    },
    [isMovingBlock]
  );
  /**
   * [isMoved] 현재 block을  movingTargetBlock (위치를 변경시킬 block)의 위치변경의 기준이 되는 pointBlock 지정을 취소시키는 함수
   * @param event
   */
  const cancelPointBlock = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isMovingBlock()) {
        event.currentTarget.classList.remove("on");
      }
    },
    [isMovingBlock]
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
      const newContentsDoc = document.getElementById(
        `${newBlockItem}__contents`
      );
      if (newContentsDoc) {
        const newBlockContentEditableDoc =
          newContentsDoc.firstElementChild as HTMLElement;
        newBlockContentEditableDoc.focus();
      }
      sessionStorage.removeItem(SESSION_KEY.newBlock);
    }
  }, [block]);

  return (
    <div className="editableBlock">
      <div className="inner">
        <div
          id={`block-${block.id}`}
          className={className}
          style={changeFontSizeBySmallText(block, props.fontSize)}
        >
          {block.type.includes("ListArr") ? (
            <ListSub
              {...props}
              subBlocks={subBlocks}
              isOpenComments={isOpenComments}
              markPointBlock={markPointBlock}
              cancelPointBlock={cancelPointBlock}
            />
          ) : (
            <>
              <div
                className="mainBlock"
                onMouseEnter={markPointBlock}
                onMouseLeave={cancelPointBlock}
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
                        openExport={props.openExport}
                      />
                    </div>
                  )}

                  <BlockContents {...props} />
                </div>
                {isOpenComments && props.onClickCommentBtn && (
                  <BlockComment
                    block={block}
                    onClickCommentBtn={props.onClickCommentBtn}
                  />
                )}
              </div>
              {subBlocks && subBlocks[0] && (
                <div className="subBlock-group">
                  {subBlocks.map((subBlock: Block) => (
                    <EditableBlock
                      {...props}
                      key={subBlocks.indexOf(subBlock)}
                      block={subBlock}
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
