import React from "react";
import { CSSProperties } from "styled-components";
import { Emoji } from "../modules/notion/emojiData";
import { IconType } from "../modules/notion/type";
import pageDefaultImg from "../assets/img/icons8-페이지-개요-100.jpeg";
import EmojiIcon from "./EmojiIcon";
type PageItemProps = {
  icon: string | null;
  iconType: IconType;
  style: CSSProperties | undefined;
};
const PageIcon = ({ icon, iconType, style }: PageItemProps) => {
  const pageIconClassName: string =
    icon === null ? "page__icon iconNull" : "page__icon";
  const imgSrc: string = icon && iconType === "img" ? icon : pageDefaultImg;
  return (
    <div className={pageIconClassName} style={style}>
      {iconType === "emoji" ? (
        icon && (
          <EmojiIcon icon={icon as Emoji} otherClassName="page__icon__img" />
        )
      ) : (
        <img className="page__icon__img" alt="pageImgIcon" src={imgSrc} />
      )}
    </div>
  );
};

export default React.memo(PageIcon);
