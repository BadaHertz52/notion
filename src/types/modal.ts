import { Block } from "./module";

export type ModalTypeTarget =
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
  | "sideBarMoreFn"
  | "quickFind";

export type ModalType = {
  open: boolean;
  target?: ModalTypeTarget;
  block?: Block;
  pageId?: string;
  targetDomRect?: DOMRect;
  isMobile?: boolean;
};
