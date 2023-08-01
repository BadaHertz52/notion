import React from "react";
import { CSSProperties } from "styled-components";
import { EMOJI_DATA, Emoji } from "../modules/notion/emojiData";
import { IconType } from "../modules/notion/type";
import pageDefaultImg from "../assets/img/icons8-페이지-개요-100.jpeg";
type PageItemProps = {
  icon: string | null;
  iconType: IconType;
  style: CSSProperties | undefined;
};
const PageIcon = ({ icon, iconType, style }: PageItemProps) => {
  const pageIconClassName =
    icon === null ? "page__icon iconNull" : "page__icon";
  const imgSrc = icon
    ? iconType === "img"
      ? icon
      : EMOJI_DATA[icon as Emoji]
    : pageDefaultImg;
  return (
    <div className={pageIconClassName} style={style}>
      <span>
        <img className="page__icon__img" alt="pageImgIcon" src={imgSrc} />
      </span>
    </div>
  );
};

export default React.memo(PageIcon);
