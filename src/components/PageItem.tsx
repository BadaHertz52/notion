import React from "react";
import { pathType } from "../containers/NotionRouter";
import { Page } from "../modules/notion/type";
import ScreenOnly from "./ScreenOnly";
import PageIcon from "./PageIcon";
import { makePagePath, makeRoutePath } from "../fn";
import { CSSProperties } from "styled-components";
type PageItemProps = {
  page: Page;
  pagesId: string[];
  pages: Page[];
  addLink: (link: string) => void;
};
const PageItem = ({ page, pages, pagesId, addLink }: PageItemProps) => {
  const pagePath = makeRoutePath(page, pagesId, pages).slice(1);
  const paths = makePagePath(page, pagesId, pages);
  const setWidth = (length: number) => {
    const n = 100 / length;
    const style: CSSProperties = {
      maxWidth: `${n}%`,
    };
    return style;
  };
  return (
    <button
      title="button to open page"
      className="page__inner"
      onClick={() => addLink(pagePath)}
    >
      <ScreenOnly text="button to open page" />
      <PageIcon
        icon={page.header.icon}
        iconType={page.header.iconType}
        style={undefined}
      />
      <div className="page__inform">
        <div className="page__title">{page.header.title}</div>
        {page.parentsId && (
          <div className="page__path-group">
            {paths?.map((path: pathType) => (
              <div className="path" style={setWidth(paths.length)}>
                {paths.indexOf(path) !== 0 && <div className="slash">/</div>}
                <div className="title">{path.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </button>
  );
};

export default React.memo(PageItem);
