import { pathType } from "../containers/NotionRouter";
import { Page } from "../modules/notion/type";
import { findPage } from ".";

export const getCurrentPageId = (): string => {
  const href = window.location.href;
  const lastSlashIndex = href.lastIndexOf("/");
  const currentPageId = href.slice(lastSlashIndex + 1);
  return currentPageId === "notion" ? "" : currentPageId;
};

export const makePagePath = (
  page: Page,
  pagesId: string[],
  pages: Page[]
): pathType[] | null => {
  if (page.parentsId) {
    const parentPages: Page[] = page.parentsId.map((id: string) =>
      findPage(pagesId, pages, id)
    );
    const pagePath: pathType[] = parentPages.concat(page).map((p: Page) => ({
      id: p.id,
      title: p.header.title,
      icon: p.header.icon,
      iconType: p.header.iconType,
    }));
    return pagePath;
  } else {
    return [
      {
        id: page.id,
        title: page.header.title,
        icon: page.header.icon,
        iconType: page.header.iconType,
      },
    ];
  }
};
export const makeRoutePath = (pageId: string): string => {
  return `/notion/${pageId}`;
};
