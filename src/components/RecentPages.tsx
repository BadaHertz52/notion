import React, { useCallback, useContext, useMemo } from "react";
import { Page } from "../modules/notion/type";
import { findPage, makeRoutePath } from "../fn";
import { Link } from "react-router-dom";
import { ActionContext } from "../containers/NotionRouter";
import PageIcon from "./PageIcon";

type RecentPagesProps = {
  pages: Page[] | null;
  pagesId: string[] | null;
  recentPagesId: string[] | null;
};
const RecentPages = ({ pages, pagesId, recentPagesId }: RecentPagesProps) => {
  const { changeSide } = useContext(ActionContext).actions;
  const recentPages: Page[] | null = useMemo(
    () =>
      pages && pagesId && recentPagesId
        ? recentPagesId.map(
            (pageId: string) => findPage(pagesId, pages, pageId) as Page
          )
        : null,
    [pages, pagesId, recentPagesId]
  );
  const onClickRecentPageItem = useCallback(() => {
    changeSide("close");
  }, [changeSide]);
  return (
    <div className="recentPages">
      <div className="header">RECENTLY VISITED PAGE</div>
      <div className="list">
        {recentPages === null ? (
          <div>No pages visited recently </div>
        ) : (
          recentPages.map((page: Page, i) => (
            <Link
              to={makeRoutePath(page.id)}
              title={`link to open page that is ${page.header.title}`}
              key={`recentPage_${i}`}
              id={`item_${page.id}`}
              className="item"
              onClick={onClickRecentPageItem}
            >
              {page.header.cover ? (
                <img
                  className="cover"
                  src={page.header.cover}
                  alt="pageCover"
                />
              ) : (
                <div className="cover none"></div>
              )}
              <PageIcon
                icon={page.header.icon}
                iconType={page.header.iconType}
                style={undefined}
              />
              <div className="title">{page.header.title}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(RecentPages);
