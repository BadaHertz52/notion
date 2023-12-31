import React, { useCallback } from "react";

import { PageList } from "../index";
import { PageListProp } from "./PageList";

import { ListItem, Page } from "../../types";
import { findPage } from "../../utils";

type FavoritesProps = Omit<PageListProp, "targetList"> & {
  favorites: string[] | null;
};

function Favorites({ ...props }: FavoritesProps) {
  const { favorites, pages, pagesId } = props;

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
          <PageList {...props} targetList={targetList} />
        </div>
      )}
    </div>
  );
}

export default React.memo(Favorites);
