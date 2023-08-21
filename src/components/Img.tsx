import React, { useState, useEffect } from "react";
import { changeImgToJpeg } from "../fn/imgLoad";
import { CSSProperties } from "styled-components";

type ImgProps = {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  style?: CSSProperties;
};
const Img = (props: ImgProps) => {
  const isGif = props.src.includes("gif");
  const item = localStorage.getItem("web_able");
  const webPAble = item === "true";
  const [jpegSrc, setJpegSrc] = useState<string>("");
  useEffect(() => {
    if (!webPAble && !isGif) {
      changeImgToJpeg(props.src, (url: string) => setJpegSrc(url));
    }
  }, [webPAble, isGif, setJpegSrc, props.src]);
  return (
    <img
      className={props.className}
      style={props.style}
      src={jpegSrc ? jpegSrc : props.src}
      alt={props.alt}
    />
  );
};

export default React.memo(Img);
