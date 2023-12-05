import { BASIC_PAGE_ICON_URL } from "../constants";
import { Page, TrashPage } from "../types";
import { getEditTime } from "./time";

export const getNewPageId = (middleNumber?: string | number) => {
  return middleNumber
    ? `page_${middleNumber}_${getEditTime()}`
    : `page_${getEditTime()}`;
};

export const getPageSample = (): Page => {
  const editTime = JSON.stringify(Date.now());
  return {
    id: getNewPageId(),
    type: "page",
    header: {
      title: "untitle",
      iconType: "img",
      icon: BASIC_PAGE_ICON_URL,
      cover: null,
      comments: null,
    },
    firstBlocksId: null,
    blocks: null,
    blocksId: null,
    subPagesId: null,
    parentsId: null,
    editTime: editTime,
    createTime: editTime,
  };
};
export const findPage = (
  pagesId: string[],
  pages: Page[],
  pageId: string
): Page | TrashPage => {
  const index: number = pagesId.indexOf(pageId);
  const PAGE: Page | TrashPage = pages[index];
  return PAGE;
};
