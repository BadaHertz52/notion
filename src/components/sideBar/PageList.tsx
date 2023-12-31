import React, { useContext, useCallback, useRef } from "react";

import { PageListItem } from "../index";

import { ActionContext } from "../../contexts";
import { ListItem, Page } from "../../types";

export type PageListProp = {
  pages: Page[] | null;
  pagesId: string[] | null;
  targetList: ListItem[];
  onClickMoreBtn: (item: ListItem, target: HTMLElement) => void;
  addNewSubPage: (item: ListItem) => void;
};

const PageList = ({ ...props }: PageListProp) => {
  const { targetList, pages, pagesId } = props;

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
    <ul ref={ulRef} className="page-list">
      {targetList.map((item) => (
        <li key={item.id}>
          <div className="main-page">
            <PageListItem
              item={item}
              onClickMoreBtn={props.onClickMoreBtn}
              addNewSubPage={props.addNewSubPage}
              changeSide={changeSide}
            />
          </div>
          {pages &&
            pagesId &&
            (item.subPagesId ? (
              <div className="sub-page">
                <PageList
                  {...props}
                  targetList={makeTargetList(item.subPagesId, pagesId, pages)}
                />
              </div>
            ) : (
              <div className="sub-page no">
                <span>No page inside</span>
              </div>
            ))}
        </li>
      ))}
    </ul>
  );
};

export default React.memo(PageList);
