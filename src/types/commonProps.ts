import { CSSProperties, Dispatch, SetStateAction } from "react";
import { Block, FontStyle, ListItem, Page } from ".";

export type StylerCommonProps = MenuAndBlockStylerCommonProps & {
  pagesId: string[];
  recentPagesId: string[] | null;
  setModalStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
};

export type TemplateFrameCommonProps = {
  userName: string;
  pages: Page[];
  pagesId: string[];
  firstList: ListItem[];
  recentPagesId: string[] | null;
  openTemplates: boolean;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
  smallText: boolean;
  fullWidth: boolean;
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
