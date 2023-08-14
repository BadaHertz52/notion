import React, { useEffect, useState } from "react";
import { Emoji, getEmojiUrl } from "../modules/notion/emojiData";
type EmojiIconProps = {
  otherClassName?: string;
  icon: Emoji;
  handleImgLoad?: () => void;
};
const EmojiIcon = ({ otherClassName, icon, handleImgLoad }: EmojiIconProps) => {
  const [url, setUrl] = useState<string>();
  const className: string = `${otherClassName ? otherClassName : ""} emojiIcon`;
  useEffect(() => {
    getEmojiUrl(icon, setUrl);
  }, [icon]);
  return (
    <img
      className={className}
      src={url}
      alt={`${icon} emoji`}
      style={{ maxWidth: "124px", maxHeight: "124px" }}
      onLoad={handleImgLoad}
    />
  );
};

export default React.memo(EmojiIcon);
