import React, {
  MouseEvent,
  TouchEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { CSSProperties } from "styled-components";

import { ScreenOnly, Img } from "../index";

import { Block, Page } from "../../types";
import {
  getBlockContentsStyle,
  getEditTime,
  setOriginTemplateItem,
} from "../../utils";

import "../../assets/imageBox.scss";

export type ImageBoxProps = {
  page: Page;
  block: Block;
  editBlock: (pageId: string, block: Block) => void;
  measure?: () => void;
};

const ImageBox = ({ page, block, editBlock, measure }: ImageBoxProps) => {
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const previousClientX = useRef(0);
  const previousClientY = useRef(0);
  const drag = useRef<boolean>(false);
  const LEFT = "left";
  const RIGHT = "right";
  const BOTTOM = "bottom";
  type DragBtnName = typeof LEFT | typeof RIGHT | typeof BOTTOM;
  const dragBtn = useRef<DragBtnName>(LEFT);
  const initialImageStyle = getBlockContentsStyle(block);
  const [imageStyle, setImageStyle] =
    useState<CSSProperties>(initialImageStyle);

  const imgSrc = block.contents.includes(";base64")
    ? block.contents
    : block.contents +
      `?&height=${block.style.height ? block.style.height : 150}&width=${
        block.style.width || "auto"
      }`;

  const resizeImage = useCallback(
    (clientX: number, clientY: number) => {
      const changeX = clientX - previousClientX.current;
      const changeY = clientX - previousClientX.current;
      previousClientX.current = clientX;
      previousClientY.current = clientY;
      const imageDomRect = imageBoxRef.current?.getClientRects()[0];
      if ((changeX || changeY) && imageDomRect) {
        const imgWidth = imageDomRect.width;
        const imgHeight = imageDomRect.height;
        const width =
          dragBtn.current === RIGHT ? imgWidth + changeX : imgWidth - changeX;
        const height =
          dragBtn.current === LEFT ? imgHeight - changeY : imgHeight + changeY;

        const changedStyle = {
          width: dragBtn.current !== BOTTOM ? `${width}px` : block.style.width,
          height:
            dragBtn.current === BOTTOM ? `${height}px` : block.style.height,
        };
        setImageStyle(changedStyle);
      }
    },
    [block.style.width, block.style.height, imageBoxRef]
  );
  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (drag.current) {
        resizeImage(event.clientX, event.clientY);
      }
    },
    [resizeImage]
  );
  const onTouchMove = useCallback(
    (event: TouchEvent) => {
      if (drag.current) {
        resizeImage(
          event.changedTouches[0].clientX,
          event.changedTouches[0].clientY
        );
      }
    },
    [resizeImage]
  );

  const onMouseDownSizeBtn = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      previousClientX.current = event.clientX;
      previousClientY.current = event.clientY;
      drag.current = true;
      dragBtn.current = event.currentTarget.name as DragBtnName;
    },
    []
  );
  const onTouchStartSizeBtn = useCallback(
    (event: TouchEvent<HTMLButtonElement>) => {
      previousClientX.current = event.changedTouches[0].clientX;
      previousClientY.current = event.changedTouches[0].clientY;
      drag.current = true;
      dragBtn.current = event.currentTarget.name as DragBtnName;
    },
    []
  );

  const onMouseUp = useCallback(() => {
    const targetImgContent = document.getElementById(`${block.id}__contents`);
    if (drag.current && targetImgContent) {
      previousClientX.current = 0;
      previousClientY.current = 0;
      drag.current = false;
      const width = targetImgContent.offsetWidth;
      const height = targetImgContent.offsetHeight;

      const editedBlock: Block = {
        ...block,
        style: {
          ...block.style,
          width: `${width}px`,
          height: `${height}px`,
        },
        editTime: getEditTime(),
      };
      setOriginTemplateItem(page);
      editBlock(page.id, editedBlock);
    }
  }, [block, editBlock, page]);

  return (
    <div
      className="img-box"
      ref={imageBoxRef}
      style={imageStyle}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseUp={onMouseUp}
      onTouchEnd={onMouseUp}
    >
      <button
        title="left button to resize image"
        className="btn-size length left"
        name={LEFT}
        onMouseDown={onMouseDownSizeBtn}
        onTouchStart={onTouchStartSizeBtn}
      >
        <ScreenOnly text="left button to resize image" />
        <span></span>
      </button>
      <button
        title="right button to resize image"
        className="btn-size length right"
        name={RIGHT}
        onMouseDown={onMouseDownSizeBtn}
        onTouchStart={onTouchStartSizeBtn}
      >
        <ScreenOnly text="right button to resize image" />
        <span></span>
      </button>
      <button
        title="bottom button to resize image"
        className="btn-size transverse bottom "
        name={BOTTOM}
        onMouseDown={onMouseDownSizeBtn}
        onTouchStart={onTouchStartSizeBtn}
      >
        <ScreenOnly text="bottom button to resize image" />
        <span></span>
      </button>
      <Img src={imgSrc} alt="block_photo" onLoad={measure} style={imageStyle} />
    </div>
  );
};

export default React.memo(ImageBox);
