import { pathType } from "../containers/NotionRouter";
import { Page } from "../modules/notion/type";
import { findPage } from ".";

export const getCurrentPageId = () => {
  const path = window.location.pathname;
  const lastSlash = path.lastIndexOf("/");
  const currentPageId = path.slice(lastSlash + 1);
  return currentPageId;
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
export const makeRoutePath = (
  page: Page,
  pagesId: string[],
  pages: Page[]
): string => {
  let path = "";
  if (page.parentsId === null) {
    path = `/${page.id}`;
  } else {
    const pagePath = makePagePath(page, pagesId, pages);
    if (pagePath) {
      let PATH = "";
      for (let i = 0; i <= pagePath.length; i++) {
        if (i < pagePath.length) {
          const element: pathType = pagePath[i];
          const id: string = element.id;
          PATH = PATH.concat(`/${id}`);
          if (i === pagePath.length - 1) {
            path = PATH;
          }
        }
      }
    }
  }
  return path;
};
