import React, { useEffect, useState } from "react";
import { Emoji, getEmojiUrl } from "../modules/notion/emojiData";
type EmojiIconProps = {
  otherClassName?: string;
  icon: Emoji;
};
const EmojiIcon = ({ otherClassName, icon }: EmojiIconProps) => {
  const [url, setUrl] = useState<string>();
  const className: string = `${otherClassName ? otherClassName : ""} emojiIcon`;
  useEffect(() => {
    getEmojiUrl(icon, setUrl);
  }, [icon]);
  return (
    <>
      <img className={className} src={url} alt={`${icon} emoji`} />
    </>
  );
};

export default React.memo(EmojiIcon);
