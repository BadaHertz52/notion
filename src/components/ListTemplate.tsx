import React, { useContext, useCallback } from "react";
import { ListItem, Notion, Page } from "../modules/notion/type";
import { SideAppear } from "../modules/side/reducer";
import { ActionContext } from "../route/NotionRouter";
import ItemTemplate from "./ItemTemplate";

type ListTemplateProp = {
  notion: Notion;
  targetList: ListItem[] | null;
  onClickMoreBtn: (item: ListItem, target: HTMLElement) => void;
  addNewSubPage: (item: ListItem) => void;
  changeSide: (appear: SideAppear) => void;
};

const ListTemplate = ({
  notion,
  targetList,
  addNewSubPage,
  onClickMoreBtn,
}: ListTemplateProp) => {
  const { changeSide } = useContext(ActionContext).actions;
  const findSubPage = (
    id: string,
    pagesId: string[],
    pages: Page[]
  ): ListItem => {
    const index = pagesId.indexOf(id);
    const subPage: Page = pages[index];
    return {
      id: subPage.id,
      title: subPage.header.title,
      iconType: subPage.header.iconType,
      icon: subPage.header.icon,
      subPagesId: subPage.subPagesId,
      parentsId: subPage.parentsId,
      editTime: subPage.editTime,
      createTime: subPage.createTime,
    };
  };
  const makeTargetList = useCallback(
    (ids: string[], pagesId: string[], pages: Page[]): ListItem[] => {
      const listItemArr: ListItem[] = ids.map((id: string) =>
        findSubPage(id, pagesId, pages)
      );
      return listItemArr;
    },
    []
  );
  return (
    <ul>
      {targetList?.map((item: ListItem) => (
        <li aria-details={`page:${item.id}`} key={item.id}>
          <div className="mainPage">
            <ItemTemplate
              item={item}
              onClickMoreBtn={onClickMoreBtn}
              addNewSubPage={addNewSubPage}
              changeSide={changeSide}
            />
          </div>
          {notion.pages &&
            notion.pagesId &&
            (item.subPagesId ? (
              <div className="subPage">
                <ListTemplate
                  notion={notion}
                  targetList={makeTargetList(
                    item.subPagesId,
                    notion.pagesId,
                    notion.pages
                  )}
                  onClickMoreBtn={onClickMoreBtn}
                  addNewSubPage={addNewSubPage}
                  changeSide={changeSide}
                />
              </div>
            ) : (
              <div className="subPage no">
                <span>No page inside</span>
              </div>
            ))}
        </li>
      ))}
    </ul>
  );
};

export default React.memo(ListTemplate);
