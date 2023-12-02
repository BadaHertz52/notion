import { CSSProperties } from "styled-components";
import { Block } from "../types";

export const changeFontSizeBySmallText = (
  block: Block,
  fontSize: number
): CSSProperties => {
  const baseSize = fontSize;
  let ratio = 1;
  switch (block.type) {
    case "h1":
      window.innerWidth > 768 ? (ratio = 2.5) : (ratio = 2);
      break;
    case "h2":
      window.innerWidth > 768 ? (ratio = 2.2) : (ratio = 1.6);
      break;
    case "h3":
      window.innerWidth > 768 ? (ratio = 2) : (ratio = 1.3);
      break;
    default:
      break;
  }
  const style: CSSProperties = {
    fontSize: `${baseSize * ratio}rem`,
  };
  return style;
};
