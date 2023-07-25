import React, { useContext, useMemo } from "react";
import { ActionContext } from "../containers/NotionRouter";
import ScreenOnly from "./ScreenOnly";
import { AiOutlinePlus } from "react-icons/ai";
import { ListItem, Notion, Page } from "../modules/notion/type";
import ListTemplate from "./ListTemplate";
type PrivateProps = {
  notion: Notion;
  firstPages: Page[] | null;
  addNewPage: () => void;
  addNewSubPage: (item: ListItem) => void;
  onClickMoreBtn: (item: ListItem, target: HTMLElement) => void;
};
function Private({
  notion,
  firstPages,
  addNewPage,
  addNewSubPage,
  onClickMoreBtn,
}: PrivateProps) {
  const { changeSide } = useContext(ActionContext).actions;
  const list: ListItem[] | null = useMemo(
    () =>
      firstPages
        ? firstPages
            .filter((page: Page) => page.parentsId === null)
            .map((page: Page) => ({
              id: page.id,
              iconType: page.header.iconType,
              icon: page.header.icon,
              title: page.header.title,
              subPagesId: page.subPagesId,
              parentsId: page.parentsId,
              editTime: page.editTime,
              createTime: page.createTime,
            }))
        : null,
    [firstPages]
  );
  return (
    <div className="private">
      <div className="header">
        <span>PRIVATE</span>
        <button
          className="btn-addPage"
          title="Quickly add a page inside"
          onClick={addNewPage}
        >
          <ScreenOnly text="Quickly add a page inside" />
          <AiOutlinePlus />
        </button>
      </div>
      {notion.pages && (
        <div className="list">
          {notion.pages[0] && (
            <ListTemplate
              notion={notion}
              targetList={list}
              onClickMoreBtn={onClickMoreBtn}
              addNewSubPage={addNewSubPage}
              changeSide={changeSide}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(Private);
