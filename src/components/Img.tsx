import React, { useState, useEffect, useRef } from "react";
import { changeImgToJpeg } from "../fn/imgLoad";
import { CSSProperties } from "styled-components";
import catImg from "../assets/img/cat.webp";
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
  const [imgSrc, setImgSrc] = useState<string>(props.src);
  useEffect(() => {
    const basicImgName = ["artificial-turf", "basic-page", "cat", "roses"];
    const basicImgArray = [basicPageCover, basicPageIcon, catImg, imgBlockImg];
    const isExport = document.getElementById("export");
    if (isExport && (imgRef.current?.closest(".frame") || !webPAble)) {
      const target = basicImgArray.filter(
        (i) => props.src.includes(i) || props.src === i
      )[0];
      const name = basicImgName[basicImgArray.indexOf(target)];
      const url = `https://raw.githubusercontent.com/BadaHertz52/notion/master/src/assets/img/${name}.jpeg`;
      setImgSrc(url);
    } else {
      if (!webPAble && !isGif) {
        changeImgToJpeg(props.src, (url: string) => setImgSrc(url));
      }
    }
  }, [webPAble, isGif, setImgSrc, props.src]);
  return (
    <img
      className={props.className}
      style={props.style}
      src={imgSrc}
      alt={props.alt}
      ref={imgRef}
    />
  );
};

export default React.memo(Img);
