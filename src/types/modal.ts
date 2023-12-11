import { Block } from "./module";

export type ModalTypeTarget =
  | "blockStyler"
  | "command"
  | "commentInput"
  | "comments"
  | "loader"
  | "menu"
  | "mobileMenu"
  | "moveTargetBlock"
  | "pageMenu"
  | "sideBarMoreFn"
  | "templates"
  | "trash"
  | "rename"
  | "quickFind";

export type ModalType = {
  open: boolean;
  target?: ModalTypeTarget;
  block?: Block;
  pageId?: string;
  targetDomRect?: DOMRect;
  isMobile?: boolean;
};
