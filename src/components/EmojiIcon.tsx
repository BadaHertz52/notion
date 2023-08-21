import React from "react";
import { EMOJI_ARR, EMOJI_DATA, Emoji } from "../modules/notion/emojiData";
import transparentImg from "../assets/img/transparent.jpeg";
import { CSSProperties } from "styled-components";
import "../assets/emoji.scss";
type EmojiIconProps = {
  otherClassName?: string;
  emojiSrc?: string;
  icon: Emoji;
  handleImgLoad?: () => void;
};
const EmojiIcon = ({ otherClassName, icon, handleImgLoad }: EmojiIconProps) => {
  const className: string = `${otherClassName ? otherClassName : ""} emojiIcon`;
  const x = 100 / (EMOJI_ARR.length - 1);
  const style: CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundSize: `${100 * EMOJI_ARR.length}% 100%`,
    backgroundPositionY: 0,
    backgroundPositionX: `${x * EMOJI_ARR.indexOf(icon)}%`,
  };
  return (
    <img
      className={className}
      src={transparentImg}
      loading="lazy"
      alt={EMOJI_DATA[icon]}
      style={style}
      onLoad={handleImgLoad}
    />
  );
};

export default React.memo(EmojiIcon);
