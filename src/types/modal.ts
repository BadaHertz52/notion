import { Block } from "./notion";

export type FrameModalTargetType =
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
export type FrameModalType = {
  open: boolean;
  target: FrameModalTargetType | undefined;
  block: Block | undefined;
};
