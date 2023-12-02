import React, { useCallback, useContext } from "react";

import { ListTemplate } from "../index";

import { ActionContext } from "../../contexts";
import { ListItem, Notion, Page } from "../../types";
import { findPage } from "../../utils";

type FavoritesProps = {
  favorites: string[] | null;
  notion: Notion;
  pagesId: string[] | null;
  pages: Page[] | null;
  onClickMoreBtn: (item: ListItem, target: HTMLElement) => void;
  addNewSubPage: (item: ListItem) => void;
};

function Favorites({
  favorites,
  notion,
  pages,
  pagesId,
  onClickMoreBtn,
  addNewSubPage,
}: FavoritesProps) {
  const { changeSide } = useContext(ActionContext).actions;
  const makeFavoriteList = useCallback(
    (
      favorites: string[] | null,
      pagesId: string[],
      pages: Page[]
    ): ListItem[] | null => {
      const list: ListItem[] | null = favorites
        ? favorites.map((id: string) => {
            const page = findPage(pagesId, pages, id);
            const ListItem = {
              id: page.id,
              title: page.header.title,
              iconType: page.header.iconType,
              icon: page.header.icon,
              subPagesId: page.subPagesId,
              parentsId: page.parentsId,
              editTime: page.editTime,
              createTime: page.createTime,
            };
            return ListItem;
          })
        : null;
      return list;
    },
    []
  );

  const targetList =
    pagesId && pages ? makeFavoriteList(favorites, pagesId, pages) : null;

  return (
    <div className="favorites">
      <div className="header">
        <span>FAVORITES </span>
      </div>
      {targetList && (
        <div className="list">
          <ListTemplate
            notion={notion}
            targetList={targetList}
            onClickMoreBtn={onClickMoreBtn}
            addNewSubPage={addNewSubPage}
            changeSide={changeSide}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(Favorites);
