import React, { useState, useEffect, useRef } from "react";
import { changeImgToJpeg } from "../fn/imgLoad";
import { CSSProperties } from "styled-components";
type ImgProps = {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  style?: CSSProperties;
};
const Img = ({ src, alt, className, onLoad, style }: ImgProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const isGif = src.includes("gif");
  const item = localStorage.getItem("webP_able");
  const webPAble = item === "true";
  const [jpegSrc, setJpegSrc] = useState<string>();

  useEffect(() => {
    const githubAssetsUrl =
      "raw.githubusercontent.com/BadaHertz52/notion/master/src/assets/img/";
    if (!webPAble) {
      if (src.includes(githubAssetsUrl)) {
        const url = src.replace("webp", "jpeg");
        setJpegSrc(url);
      } else if (!isGif) {
        changeImgToJpeg(src, (url: string) => setJpegSrc(url));
      }
    }
  }, [webPAble, isGif, setJpegSrc, src]);
  return (
    <picture>
      <source srcSet={src} type="image/webp" />
      <source srcSet={jpegSrc} type="image/jpeg" />
      <img
        className={className}
        style={style}
        src={!webPAble ? jpegSrc : src}
        alt={alt}
        ref={imgRef}
        onLoad={onLoad}
      />
    </picture>
  );
};

export default React.memo(Img);
