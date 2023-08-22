import React from "react";
import { CSSProperties } from "styled-components";
import { Emoji } from "../modules/notion/emojiData";
import { IconType } from "../modules/notion/type";
import EmojiIcon from "./EmojiIcon";
import Img from "./Img";
import { pageSample } from "../modules/notion/reducer";
type PageIconProps = {
  icon: string | null;
  iconType: IconType;
  style: CSSProperties | undefined;
  handleImgLoad?: () => void;
  isInPageHeader?: boolean;
  openExport?: boolean;
};
const PageIcon = ({
  icon,
  iconType,
  style,
  handleImgLoad,
  isInPageHeader = false,
  openExport,
}: PageIconProps) => {
  const pageIconClassName: string =
    icon === null ? "page__icon iconNull" : "page__icon";
  const img = icon ? icon : (pageSample.header.icon as string);
  const imgSrc =
    isInPageHeader && !img.includes(";base64")
      ? img + "?&height=72&width=72"
      : img;
  return (
    <div className={pageIconClassName} style={style}>
      {iconType === "emoji" ? (
        icon && (
          <EmojiIcon
            icon={icon as Emoji}
            otherClassName="page__icon__img"
            handleImgLoad={handleImgLoad}
            openExport={openExport}
            isInPageHeader={isInPageHeader}
          />
        )
      ) : (
        <Img
          className="page__icon__img"
          style={{ width: "100%", height: "100%" }}
          alt="pageImgIcon"
          src={imgSrc}
          onLoad={handleImgLoad}
        />
      )}
    </div>
  );
};

export default React.memo(PageIcon);
