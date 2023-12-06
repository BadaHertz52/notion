import { MouseEvent } from "react";
import { Block } from "./notion";

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
  | "trash";

export type ModalType = {
  open: boolean;
  target?: ModalTypeTargetType;
  block?: Block;
  pageId?: string;
  targetDomRect?: DOMRect;
  isMobile?: boolean;
};
