import React, { MouseEvent } from "react";
import { CSSProperties } from "styled-components";

import { FontStyleType } from "../../types";

type FontBtnProps = {
  selectedFonStyle: FontStyleType;
  fontStyle: FontStyleType;
  changeFontStyle: (event: MouseEvent, font: FontStyleType) => void;
  returnFontFamily: (font: FontStyleType) => CSSProperties;
};

const FontBtn = ({
  selectedFonStyle,
  fontStyle,
  changeFontStyle,
  returnFontFamily,
}: FontBtnProps) => {
  const title = `${fontStyle} font btn`;
  const fontName =
    fontStyle === "default"
      ? "Default"
      : fontStyle === "mono"
      ? "Mono"
      : "Serif";

  const className = `font-sample ${fontStyle === selectedFonStyle ? "on" : ""}`;
  return (
    <button
      title={title}
      onClick={(event) => changeFontStyle(event, fontStyle)}
    >
      <div className={className} style={returnFontFamily(fontStyle)}>
        Ag
      </div>
      <div className="font-name">{fontName}</div>
    </button>
  );
};

export default React.memo(FontBtn);
