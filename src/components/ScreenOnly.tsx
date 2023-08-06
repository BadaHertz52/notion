import React from "react";
import { CSSProperties } from "styled-components";

type ScreenOnlyProps = {
  text: string;
};
const ScreenOnly = ({ text }: ScreenOnlyProps) => {
  const style: CSSProperties = {
    position: "absolute",
    clip: "rect(1px, 1px, 1px, 1px)",
    padding: "0 ",
    border: "0 ",
    height: "1px ",
    width: "1px ",
    overflow: "hidden",
  };

  return (
    <span className="screenOnly" style={style}>
      {text}
    </span>
  );
};

export default React.memo(ScreenOnly);
