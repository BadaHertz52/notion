import React from "react";
import { EMOJI_ARR, EMOJI_DATA, Emoji } from "../modules/notion/emojiData";
import transparentImg from "../assets/img/transparent.webp";
import { CSSProperties } from "styled-components";
import "../assets/emoji.scss";
import spritePng from "../assets/img/emoji_sprite.png";
import spriteWebP from "../assets/img/emoji_sprite.webp";
import Img from "./Img";

type EmojiIconProps = {
  otherClassName?: string;
  emojiSrc?: string;
  icon: Emoji;
  handleImgLoad?: () => void;
};
const EmojiIcon = ({ otherClassName, icon, handleImgLoad }: EmojiIconProps) => {
  const webAbleItem = localStorage.getItem("webP_able");
  const webAble = webAbleItem === "true";
  const className: string = `${otherClassName ? otherClassName : ""} emojiIcon`;
  const x = 100 / (EMOJI_ARR.length - 1);
  const style: CSSProperties = {
    width: "100%",
    height: "100%",

    background: `url(${webAble ? spriteWebP : spritePng}) no-repeat top left`,
    backgroundPositionY: 0,
    backgroundPositionX: `${x * EMOJI_ARR.indexOf(icon)}%`,
    backgroundSize: `${100 * EMOJI_ARR.length}% 100%`,
  };
  return (
    <img
      className={className}
      src={transparentImg}
      alt={EMOJI_DATA[icon]}
      style={style}
      onLoad={handleImgLoad}
    />
  );
};

export default React.memo(EmojiIcon);
