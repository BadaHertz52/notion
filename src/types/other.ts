import { Block, IconType } from ".";
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
export type SelectionType = {
  /**
   * origin block data (수정이전에 block data)
   */
  block: Block;
  /**
   * blockStyler에 의한 block data의 변화가 있는 지 여부
   */
  change: boolean;
};

export type CommandType = {
  open: boolean;
  command: string | null;
  targetBlock: Block | null;
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
