import { Block, IconType } from ".";
import { OPTION } from "../constants";
import { FONT_FAMILY } from "../constants/font";

export type FontStyleType = keyof typeof FONT_FAMILY;

export type MobileSideMenuWhatType =
  | "ms_turnInto"
  | "ms_movePage"
  | "ms_color"
  | "ms_moreMenu"
  | "ms_link"
  | undefined;

export type MobileSideMenuType = {
  block: Block | null;
  what: MobileSideMenuWhatType;
};
export type PathType = {
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

export type Command = {
  open: boolean;
  command: string | null;
  targetBlock: Block | null;
};

// export type ModalType = {
//   open: boolean;
//   what: "modalMoveToPage" | "modalComment" | "modalCommand" | null;
// };

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
