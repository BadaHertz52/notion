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
  | "rename";

export type ModalType = {
  open: boolean;
  target: ModalTypeTargetType | undefined;
  block: Block | undefined;
};
