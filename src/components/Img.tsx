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
  const webAble = item ? item === "true" : false;
  const [jpegSrc, setJpegSrc] = useState<string>("");

  useEffect(() => {
    if (!webAble && !isGif) {
      changeImgToJpeg(props.src, (url: string) => setJpegSrc(url));
    }
  }, [webAble, isGif, setJpegSrc, props.src]);
  return (
    <picture>
      {isGif ? (
        <img
          className={props.className}
          style={props.style}
          src={props.src}
          alt={props.alt}
        />
      ) : (
        <>
          <source srcSet={props.src} type="image/webp" />
          <source srcSet={jpegSrc} type="image/jpeg" />
          <img
            className={props.className}
            style={props.style}
            src={props.src}
            alt={props.alt}
          />
        </>
      )}
    </picture>
  );
};

export default Img;
