import React from "react";
import { CSSProperties } from "styled-components";
import { emojiPath, IconType } from "../modules/notion";
import pageDefultImg from "../assets/img/icons8-페이지-개요-100.png";
type PageItemProps = {
  icon: string | null;
  iconType: IconType;
  style: CSSProperties | undefined;
};
const PageIcon = ({ icon, iconType, style }: PageItemProps) => {
  const pageIconClassName =
    icon === null ? "page__icon iconNull" : "page__icon";
  const imgSrc =
    icon !== null
      ? iconType === "img"
        ? icon
        : `${emojiPath}${icon}.png`
      : pageDefultImg;
  return (
    <div className={pageIconClassName} style={style}>
      <span>
        <img className="page__icon__img" alt="pageImgIcon" src={imgSrc} />
      </span>
    </div>
  );
};

export default React.memo(PageIcon);
