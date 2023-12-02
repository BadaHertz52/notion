import { BlockStyle, BlockType } from "../types";

export const BLOCK_TYPES: BlockType[] = [
  "text",
  "toggle",
  "todo",
  "todo_done",
  "image",
  "h1",
  "h2",
  "h3",
  "page",
  "numberList",
  "bulletList",
];

export const BASIC_BLOCK_STYLE: BlockStyle = {
  color:"default",
  bgColor: "default",
  width: undefined,
  height: undefined,
};
