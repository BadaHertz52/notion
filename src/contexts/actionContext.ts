import { createContext } from "react";
import { Block, Page, SideAppear } from "../types";

const initialNotionActions = {
  addBlock: (
    pageId: string,
    block: Block,
    newBlockIndex: number,
    previousBlockId: string | null
  ) => {},
  editBlock: (pageId: string, block: Block) => {},
  deleteBlock: (pageId: string, block: Block, isInMenu: boolean) => {},
  changeBlockToPage: (currentPageId: string, block: Block) => {},
  changePageToBlock: (currentPageId: string, block: Block) => {},
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => {},
  raiseBlock: (pageId: string, block: Block) => {},
  addPage: (newPage: Page) => {},
  deletePage: (pageId: string) => {},
  duplicatePage: (targetPageId: string) => {},
  editPage: (pageId: string, newPage: Page) => {},
  movePageToPage: (targetPageId: string, destinationPageId: string) => {},
  restorePage: (pageId: string) => {},
  cleanTrash: (pageId: string) => {},
  addRecentPage: (itemId: string) => {},
  cleanRecentPage: () => {},
  addFavorites: (itemId: string) => {},
  removeFavorites: (itemId: string) => {},
  changeSide: (appear: SideAppear) => {},
};

export const ActionContext = createContext({ actions: initialNotionActions });
