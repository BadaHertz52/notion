import React, { MouseEvent } from "react";
import { FrameFontStyleType } from "./TopBar";
import { CSSProperties } from "styled-components";

type FontBtnProps = {
  selectedFonStyle: FrameFontStyleType;
  fontStyle: FrameFontStyleType;
  changeFontStyle: (event: MouseEvent, font: FrameFontStyleType) => void;
  returnFontFamily: (font: FrameFontStyleType) => CSSProperties;
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
