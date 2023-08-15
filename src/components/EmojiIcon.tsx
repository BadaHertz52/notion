import React, { useEffect, useState } from "react";
import { Emoji, getEmojiUrl } from "../modules/notion/emojiData";
import basicImg from "../assets/img/basicImg.jpeg";
type EmojiIconProps = {
  otherClassName?: string;
  emojiSrc?: string;
  icon: Emoji;
  handleImgLoad?: () => void;
};
const EmojiIcon = ({ otherClassName, icon, handleImgLoad }: EmojiIconProps) => {
  const [src, setSrc] = useState<string | undefined>(basicImg);
  const className: string = `${otherClassName ? otherClassName : ""} emojiIcon`;
  useEffect(() => {
    getEmojiUrl(icon, setSrc);
  }, [icon]);
  return (
    <img
      className={className}
      src={src}
      alt={`${icon} emoji`}
      style={{ maxWidth: "124px", maxHeight: "124px" }}
      onLoad={handleImgLoad}
    />
  );
};

export default React.memo(EmojiIcon);
