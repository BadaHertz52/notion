import React from "react";

import { CSSProperties } from "styled-components";

import { EMOJI_ARRAY, EMOJI_DATA } from "../../constants";
import { Emoji } from "../../types";

import "../../assets/emoji.scss";
import transparentImg from "../../assets/img/transparent.webp";
import spritePng from "../../assets/img/emoji_sprite.png";

type EmojiIconProps = {
  otherClassName?: string;
  emojiSrc?: string;
  icon: Emoji;
  handleImgLoad?: () => void;
  isExport?: boolean;
  pageIconStyle?: CSSProperties;
  isInPageHeader?: boolean;
};

const EmojiIcon = ({
  otherClassName,
  icon,
  handleImgLoad,
  isExport = false,
  isInPageHeader,
}: EmojiIconProps) => {
  const className: string = `${otherClassName ? otherClassName : ""} emojiIcon`;
  const x = 100 / (EMOJI_ARRAY.length - 1);
  const fontSize = isInPageHeader ? 55 : 14;
  const style: CSSProperties = {
    width: "100%",
    height: "100%",
    background: `url(${spritePng}) no-repeat top left`,
    backgroundPositionY: 0,
    backgroundPositionX: `${x * EMOJI_ARRAY.indexOf(icon)}%`,
    backgroundSize: `${100 * EMOJI_ARRAY.length}% 100%`,
  };
  return (
    <>
      {isExport ? (
        <span
          className={className}
          style={{
            width: "100%",
            height: "100%",
            fontSize: fontSize,
          }}
        >
          {EMOJI_DATA[icon]}
        </span>
      ) : (
        <img
          className={className}
          src={transparentImg}
          alt={EMOJI_DATA[icon]}
          style={style}
          onLoad={handleImgLoad}
        />
      )}
    </>
  );
};

export default React.memo(EmojiIcon);
