import React, { MouseEvent } from "react";

import { CSSProperties } from "styled-components";

import { EmojiIcon, Img } from "../index";

import { IconType, Emoji } from "../../types";
import { getPageSample } from "../../utils";

type PageIconProps = {
  icon: string | null;
  iconType: IconType;
  style?: CSSProperties;
  handleImgLoad?: () => void;
  isInPageHeader?: boolean;
  openExport?: boolean;
  onClick?: (event: MouseEvent) => void;
};

const PageIcon = ({
  icon,
  iconType,
  style,
  handleImgLoad,
  isInPageHeader = false,
  openExport,
  onClick,
}: PageIconProps) => {
  const pageIconClassName: string =
    icon === null ? "page__icon iconNull" : "page__icon";
  const img = icon ? icon : (getPageSample().header.icon as string);
  const imgSrc =
    isInPageHeader && !img.includes(";base64")
      ? img + "?&height=72&width=72"
      : img;
  return (
    <div className={pageIconClassName} style={style} onClick={onClick}>
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
