import React from "react";
import styled from "styled-components";

type ScreenOnlyProps = {
  text: string;
};
const ScreenOnly = ({ text }: ScreenOnlyProps) => {
  const ScreenOnlySpan = styled.span`
    position: absolute !important;
    clip: rect(1px, 1px, 1px, 1px);
    padding: 0 !important;
    border: 0 !important;
    height: 1px !important;
    width: 1px !important;
    overflow: hidden;
  `;
  return <ScreenOnlySpan>{text}</ScreenOnlySpan>;
};

export default React.memo(ScreenOnly);
