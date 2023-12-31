import React, { useCallback, useContext } from "react";

import { MdPlayArrow } from "react-icons/md";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";

import { PageIcon, ScreenOnly } from "../index";

import { getEditTime, setOriginTemplateItem } from "../../utils";
import { Block, Page } from "../../types";
import { ActionContext } from "../../contexts";

type BlockBtnProps = {
  page: Page;
  block: Block;
  isExport?: boolean;
};
const BlockBtn = ({ page, block, isExport }: BlockBtnProps) => {
  const { editBlock } = useContext(ActionContext).actions;

  const onClickTodoBtn = useCallback(() => {
    const editedBlock: Block = {
      ...block,
      type: block.type === "todo" ? "todo_done" : "todo",
      editTime: getEditTime(),
    };
    setOriginTemplateItem(page);
    editBlock(page.id, editedBlock);
  }, [block, editBlock, page]);

  const onClickToggle = useCallback((event: React.MouseEvent) => {
    const target = event.currentTarget;
    const blockId = target.getAttribute("name");
    const toggleMainDoc = document.getElementById(`block-${blockId}`);
    target.classList.toggle("on");
    toggleMainDoc?.classList.toggle("on");
  }, []);

  return (
    <>
      {block.type === "todo" && (
        <button
          title="button to check"
          className="checkbox left block__btn"
          name={block.id}
          onClick={onClickTodoBtn}
        >
          <ScreenOnly text="button to check" />
          <GrCheckbox />
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
            isExport={isExport}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(BlockBtn);
