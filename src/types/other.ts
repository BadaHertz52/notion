import { IconType } from ".";
import { OPTION } from "../constants";
import { FONT_FAMILY } from "../constants/font";

export type FontStyle = keyof typeof FONT_FAMILY;

export type Path = {
  id: string;
  title: string;
  icon: string | null;
  iconType: IconType;
};
export type DiscardItemType = {
  discard: boolean;
};

export type ResultType = {
  id: string;
  title: string;
  icon: string | null;
  iconType: IconType;
  createTime: string;
  editTime: string;
  path: string | null;
};

export type QuickFindBoardOption = keyof typeof OPTION;
