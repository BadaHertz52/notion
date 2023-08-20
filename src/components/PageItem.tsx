import React from "react";
import { Page } from "../modules/notion/type";
import ScreenOnly from "./ScreenOnly";
import PageIcon from "./PageIcon";
import { makePagePath, makeRoutePath } from "../fn";
import { CSSProperties } from "styled-components";
type PageItemProps = {
  page: Page;
  pagesId: string[];
  pages: Page[];
  style: CSSProperties;
  iconHeight: number;
  addLink: (link: string) => void;
};
const PageItem = ({
  page,
  pages,
  pagesId,
  addLink,
  style,
  iconHeight,
}: PageItemProps) => {
  const pagePath = makeRoutePath(page.id).slice(1);
  const path = makePagePath(page, pagesId, pages)
    ?.map((p) => p.title)
    .join("/");
  const btnPadding = 14;
  const iconMargin = 10;
  const informWidth = style.width
    ? (typeof style.width === "number"
        ? style.width
        : Number(style.width?.replace("px", ""))) -
      iconHeight -
      btnPadding * 2 -
      iconMargin
    : 0;
  return (
    <button
      title="button to open page"
      className="page-item"
      onClick={() => addLink(pagePath)}
      style={style}
    >
      <ScreenOnly text="button to open page" />
      <PageIcon
        icon={page.header.icon}
        iconType={page.header.iconType}
        style={{ width: iconHeight, height: iconHeight }}
      />
      <div className="page__inform">
        <div className="page__title" style={{ width: informWidth }}>
          {page.header.title}
        </div>
        {path && (
          <div className="page__path" style={{ width: informWidth }}>
            {path}
          </div>
        )}
      </div>
    </button>
  );
};

export default React.memo(PageItem);
