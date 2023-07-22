import React, {
  MouseEvent,
  TouchEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { CSSProperties } from "styled-components";
import { Block, Page } from "../modules/notion/type";
import { setTemplateItem } from "../fn";
import ScreenOnly from "./ScreenOnly";

type ImageContentProps = {
  page: Page;
  block: Block;
  editBlock: (pageId: string, block: Block) => void;
};
const ImageContent = ({ page, block, editBlock }: ImageContentProps) => {
  const previousClientX = useRef(0);
  const previousClientY = useRef(0);
  const drag = useRef<boolean>(false);
  const LEFT = "left";
  const RIGHT = "right";
  const BOTTOM = "bottom";
  type DragBtnName = typeof LEFT | typeof RIGHT | typeof BOTTOM;
  const dragBtn = useRef<DragBtnName>(LEFT);
  const [imageStyle, setImageStyle] = useState<CSSProperties>();

  const resizeImage = useCallback(
    (clientX: number, clientY: number) => {
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
            dragBtn.current === RIGHT ? imgWidth + changeX : imgWidth - changeX;
          const height =
            dragBtn.current === LEFT
              ? imgHeight - changeY
              : imgHeight + changeY;
          const changedStyle = {
            width:
              dragBtn.current !== BOTTOM ? `${width}px` : block.style.width,
            height: `${height}px`,
          };
          setImageStyle(changedStyle);
        }
      }
    },
    [block.id, block.style.width]
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
        editTime: JSON.stringify(Date.now()),
      };
      const templateHtml = document.getElementById("template");
      setTemplateItem(templateHtml, page);
      editBlock(page.id, editedBlock);
    }
  }, [block, editBlock, page]);

  return (
    <div
      className="img-contents"
      id={`${block.id}__contents`}
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
      <img src={block.contents} alt="block_photo" />
    </div>
  );
};

export default React.memo(ImageContent);
