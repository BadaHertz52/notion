import React, { useCallback, useContext, useMemo, useRef } from "react";
import { Page } from "../modules/notion/type";
import { findPage, makeRoutePath } from "../fn";
import { Link } from "react-router-dom";
import { ActionContext } from "../route/NotionRouter";
import PageIcon from "./PageIcon";
import { FixedSizeList } from "react-window";

type RecentPagesProps = {
  listHeight: number | string;
  itemSize: number;
  pages: Page[] | null;
  pagesId: string[] | null;
  recentPagesId: string[] | null;
};
const RecentPages = ({
  pages,
  pagesId,
  recentPagesId,
  listHeight,
  itemSize,
}: RecentPagesProps) => {
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
  const listRef = useRef<HTMLDivElement>(null);
  const listWidth = listRef.current
    ? listRef.current.clientWidth
    : window.innerWidth >= 425 && window.innerWidth <= 768
    ? window.innerWidth * 0.95
    : window.innerWidth;
  const onClickRecentPageItem = useCallback(() => {
    changeSide("close");
  }, [changeSide]);
  const Row = ({ index, measure }: { index: number; measure?: () => void }) => {
    const recentPage = recentPages?.[index];
    return recentPage ? (
      <Link
        to={makeRoutePath(recentPage.id)}
        title={`link to open page that is ${recentPage.header.title}`}
        key={`recentPage_${index}`}
        className="item"
        onClick={onClickRecentPageItem}
      >
        {recentPage.header.cover ? (
          <img
            className="cover"
            src={recentPage.header.cover}
            alt="pageCover"
            onLoad={measure}
          />
        ) : (
          <div className="cover none"></div>
        )}
        <PageIcon
          icon={recentPage.header.icon}
          iconType={recentPage.header.iconType}
          style={undefined}
          handleImgLoad={measure}
        />
        <div className="title">{recentPage.header.title}</div>
      </Link>
    ) : (
      <div> No pages visited recently </div>
    );
  };
  return (
    <div className="recentPages">
      <div className="header">RECENTLY VISITED PAGE</div>
      <div className="list" ref={listRef}>
        {recentPages && (
          <FixedSizeList
            height={listHeight}
            width={listWidth}
            layout="horizontal"
            itemCount={recentPages.length}
            itemData={recentPages}
            itemKey={(index) => recentPages[index].id}
            itemSize={itemSize}
          >
            {({ index }) => <Row index={index} />}
          </FixedSizeList>
        )}
      </div>
    </div>
  );
};

export default React.memo(RecentPages);
