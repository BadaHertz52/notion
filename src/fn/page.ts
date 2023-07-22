import { Page, TrashPage } from "../modules/notion/type";

export const findPage = (
  pagesId: string[],
  pages: Page[],
  pageId: string
): Page | TrashPage => {
  const index: number = pagesId.indexOf(pageId);
  const PAGE: Page | TrashPage = pages[index];
  return PAGE;
};
