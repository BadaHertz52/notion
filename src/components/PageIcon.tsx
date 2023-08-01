import React from "react";
import { CSSProperties } from "styled-components";
import { emojiPath } from "../modules/notion/emojiData";
import { IconType } from "../modules/notion/type";
import pageDefaultImg from "../assets/img/icons8-페이지-개요-100.png";
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
      : `${emojiPath}${icon}.png`
    : pageDefaultImg;
  return (
    <div className={pageIconClassName} style={style}>
      <span>
        <img
          className="page__icon__img"
          alt="pageImgIcon"
          style={{ maxWidth: "100px", maxHeight: "100px" }}
          src={imgSrc}
        />
      </span>
    </div>
  );
};

export default React.memo(PageIcon);
