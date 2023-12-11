import React, { useContext, useCallback, useRef } from "react";

import { PageListItem } from "../index";

import { ListItem, Notion, Page, SideAppear } from "../../types";
import { ActionContext } from "../../contexts";

type PageListProp = {
  notion: Notion;
  targetList: ListItem[];
  onClickMoreBtn: (item: ListItem, target: HTMLElement) => void;
  addNewSubPage: (item: ListItem) => void;
  changeSide: (appear: SideAppear) => void;
};

const PageList = ({
  notion,
  targetList,
  addNewSubPage,
  onClickMoreBtn,
}: PageListProp) => {
  const { changeSide } = useContext(ActionContext).actions;
  const ulRef = useRef<HTMLUListElement>(null);
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
    <ul ref={ulRef} className="pageList">
      {targetList.map((item) => (
        <li key={item.id}>
          <div className="mainPage">
            <PageListItem
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
                <PageList
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

export default React.memo(PageList);
