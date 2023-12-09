import { Block } from "./module";

export type ModalTypeTargetType =
  | "menu"
  | "pageMenu"
  | "commentInput"
  | "comments"
  | "moveTargetBlock"
  | "blockStyler"
  | "mobileMenu"
  | "command"
  | "loader"
  | "rename"
  | "trash"
  | "sideBarMoreFn";

export type ModalType = {
  open: boolean;
  target?: ModalTypeTargetType;
  block?: Block;
  pageId?: string;
  targetDomRect?: DOMRect;
  isMobile?: boolean;
};
