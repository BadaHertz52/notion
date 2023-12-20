import { CSSProperties, Dispatch, SetStateAction } from "react";
import {
  Block,
  FontStyle,
  ListItem,
  Page,
  MobileSideMenuType,
  CommandType,
} from ".";

export type StylerCommonProps = MenuAndBlockStylerCommonProps & {
  pagesId: string[];
  recentPagesId: string[] | null;
  setModalStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  setCommand: Dispatch<SetStateAction<CommandType>>;
  command: CommandType;
  setMobileSideMenu: Dispatch<SetStateAction<MobileSideMenuType>>;
  setMobileMenuTargetBlock: Dispatch<SetStateAction<Block | null>>;
};

export type TemplateFrameCommonProps = {
  userName: string;
  pages: Page[];
  pagesId: string[];
  firstList: ListItem[];
  recentPagesId: string[] | null;
  commentBlock: Block | null;
  openComment: boolean;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  openTemplates: boolean;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
  setCommentBlock: Dispatch<SetStateAction<Block | null>>;
  showAllComments: boolean;
  smallText: boolean;
  fullWidth: boolean;
  discardEdit: boolean;
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
  fontStyle: FontStyle;
  mobileSideMenu: MobileSideMenuType;
  setMobileSideMenu: Dispatch<SetStateAction<MobileSideMenuType>>;
};
//TODO -  setCommendBlock 삭제
export type MenuAndBlockStylerCommonProps = {
  pages: Page[];
  firstList: ListItem[];
  page: Page;
  block: Block;
  userName: string;
  setCommentBlock: Dispatch<SetStateAction<Block | null>>;
  frameHtml: HTMLDivElement | null;
};
