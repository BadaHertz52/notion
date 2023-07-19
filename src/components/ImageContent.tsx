import React, { MouseEvent, TouchEvent, useRef, useState } from "react";
import { CSSProperties } from "styled-components";
import { Block, Page } from "../modules/notion";
import { setTemplateItem } from "../fn";
import ScreenOnly from "./ScreenOnly";

type ImageContentProps = {
  page: Page;
  block: Block;
  editBlock: (pageId: string, block: Block) => void;
};
const ImageContent = ({ page, block, editBlock }: ImageContentProps) => {
  const imageContent = document.getElementById(`${block.id}__contents`);
  const previousClientX = useRef(0);
  const previousClientY = useRef(0);
  const drag = useRef<boolean>(false);
  const left = "left";
  const right = "right";
  const bottom = "bottom";
  type dragBtnName = typeof left | typeof right | typeof bottom;
  const dragBtn = useRef<dragBtnName>(left);
  const [imageStyle, setImageStyle] = useState<CSSProperties>();
  const resizeImage = (clientX: number, clientY: number) => {
    const targetImgContent = document.getElementById(`${block.id}__contents`);
    const changeX = clientX - previousClientX.current;
    const changeY = clientX - previousClientX.current;
    previousClientX.current = clientX;
    previousClientY.current = clientY;

    if ((changeX || changeY) && targetImgContent) {
      const imgDomRect = targetImgContent.getClientRects()[0];
      if (imgDomRect) {
        const imgWidth = imgDomRect.width;
        const imgHeight = imgDomRect.height;
        const width =
          dragBtn.current === right ? imgWidth + changeX : imgWidth - changeX;
        const height =
          dragBtn.current === left ? imgHeight - changeY : imgHeight + changeY;
        const changedStyle = {
          width: dragBtn.current !== bottom ? `${width}px` : block.style.width,
          height: `${height}px`,
        };
        setImageStyle(changedStyle);
      }
    }
  };
  const onMouseMove = (event: globalThis.MouseEvent) => {
    if (drag.current) {
      resizeImage(event.clientX, event.clientY);
    }
  };
  const onTouchMove = (event: globalThis.TouchEvent) => {
    if (drag.current) {
      resizeImage(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
      );
    }
  };

  const onMouseDownSizeBtn = (event: MouseEvent<HTMLButtonElement>) => {
    previousClientX.current = event.clientX;
    previousClientY.current = event.clientY;
    drag.current = true;
  };
  const onTouchStartSizeBtn = (event: TouchEvent<HTMLButtonElement>) => {
    previousClientX.current = event.changedTouches[0].clientX;
    previousClientY.current = event.changedTouches[0].clientY;
    drag.current = true;
  };

  const onMouseUp = () => {
    const targetImgContent = document.getElementById(`${block.id}__contents`);
    if (drag.current && targetImgContent) {
      previousClientX.current = 0;
      previousClientY.current = 0;
      drag.current = false;
      const width = targetImgContent?.offsetWidth;
      const height = targetImgContent?.offsetHeight;
      if (width && height) {
        const editedBlock: Block = {
          ...block,
          style: {
            ...block.style,
            width: `${width}px`,
            height: `${height}px`,
          },
          editTime: JSON.stringify(Date.now()),
        };
        const templateHtml = document.getElementById("template");
        setTemplateItem(templateHtml, page);
        editBlock(page.id, editedBlock);
      }
    }
  };

  imageContent?.addEventListener("mousemove", (event) => onMouseMove(event));
  imageContent?.addEventListener("touchmove", (event) => onTouchMove(event), {
    passive: true,
  });
  imageContent?.addEventListener("mouseup", onMouseUp);
  imageContent?.addEventListener("touchend", onMouseUp, { passive: true });
  return (
    <div
      className="img-contents"
      id={`${block.id}__contents`}
      style={imageStyle}
    >
      <button
        title="left button to resize image"
        className="btn-size length left"
        onMouseDown={(event) => onMouseDownSizeBtn(event)}
        onTouchStart={(event) => onTouchStartSizeBtn(event)}
      >
        <ScreenOnly text="left button to resize image" />
        <span></span>
      </button>
      <button
        title="right button to resize image"
        className="btn-size length right"
        onMouseDown={(event) => onMouseDownSizeBtn(event)}
        onTouchStart={(event) => onTouchStartSizeBtn(event)}
      >
        <ScreenOnly text="right button to resize image" />
        <span></span>
      </button>
      <button
        title="bottom button to resize image"
        className="btn-size transverse bottom "
        onMouseDown={(event) => onMouseDownSizeBtn(event)}
        onTouchStart={(event) => onTouchStartSizeBtn(event)}
      >
        <ScreenOnly text="bottom button to resize image" />
        <span></span>
      </button>
      <img src={block.contents} alt="block_photo" />
    </div>
  );
};

export default React.memo(ImageContent);
