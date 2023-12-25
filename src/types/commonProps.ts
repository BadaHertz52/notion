import { CSSProperties, Dispatch, SetStateAction } from "react";
import { Block, FontStyle, ListItem, Page } from ".";

export type StylerCommonProps = MenuAndBlockStylerCommonProps & {
  pagesId: string[];
  recentPagesId: string[] | null;
  setModalStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
};

export type TemplateFrameCommonProps = {
  userName: string;
  recentPagesId: string[] | null;
  smallText: boolean;
  fullWidth: boolean;
  fontStyle: FontStyle;
};

export type MenuAndBlockStylerCommonProps = {
  pages: Page[];
  firstList: ListItem[];
  page: Page;
  block: Block;
  userName: string;
  frameHtml: HTMLDivElement | null;
};
