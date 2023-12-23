import { CSSProperties, Dispatch, SetStateAction } from "react";
import { Block, FontStyle, ListItem, Page, CommandType } from ".";

export type StylerCommonProps = MenuAndBlockStylerCommonProps & {
  pagesId: string[];
  recentPagesId: string[] | null;
  setModalStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  setCommand: Dispatch<SetStateAction<CommandType>>;
  command: CommandType;
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
};
//TODO -  setCommendBlock 삭제
export type MenuAndBlockStylerCommonProps = {
  pages: Page[];
  firstList: ListItem[];
  page: Page;
  block: Block;
  userName: string;
  frameHtml: HTMLDivElement | null;
};
