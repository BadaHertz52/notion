import React, { useState, useEffect, useRef } from "react";
import { changeImgToJpeg } from "../fn/imgLoad";
import { CSSProperties } from "styled-components";
import imgBlockImg from "../assets/img/roses.webp";
import basicPageIcon from "../assets/img/basic-page.webp";
import basicPageCover from "../assets/img/artificial-turf.webp";
type ImgProps = {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  style?: CSSProperties;
};
const Img = (props: ImgProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const isGif = props.src.includes("gif");
  const item = localStorage.getItem("webP_able");
  const webPAble = item === "true";
  const [jpegSrc, setJpegSrc] = useState<string>();

  useEffect(() => {
    const basicImgName = ["artificial-turf", "basic-page", "roses"];
    const basicImgArray = [basicPageCover, basicPageIcon, imgBlockImg];
    const isExport = document.getElementById("export");
    if (isExport && (imgRef.current?.closest(".frame") || !webPAble)) {
      const target = basicImgArray.filter(
        (i) => props.src.includes(i) || props.src === i
      )[0];
      const name = basicImgName[basicImgArray.indexOf(target)];
      const url = `https://raw.githubusercontent.com/BadaHertz52/notion/master/src/assets/img/${name}.jpeg`;
      setJpegSrc(url);
    } else {
      if (!webPAble && !isGif) {
        changeImgToJpeg(props.src, (url: string) => setJpegSrc(url));
      }
    }
  }, [webPAble, isGif, setJpegSrc, props.src]);
  return (
    <picture>
      <source srcSet={props.src} type="image/webp" />
      <source srcSet={jpegSrc} type="image/jpeg" />
      <img
        className={props.className}
        style={props.style}
        src={props.src}
        alt={props.alt}
        ref={imgRef}
      />
    </picture>
  );
};

export default React.memo(Img);
