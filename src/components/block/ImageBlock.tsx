import React, { Dispatch, SetStateAction, useCallback } from "react";

import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";

import { ImageContent, ScreenOnly } from "../index";
import { Block } from "../../types";
import { ImageContentProps } from "./ImageContent";

type ImageBlockProps = ImageContentProps & {
  setOpenLoader: Dispatch<SetStateAction<boolean>>;
  setLoaderTargetBlock: (value: SetStateAction<Block | null>) => void;
};

const ImageBlock = ({ ...props }: ImageBlockProps) => {
  const { block, setOpenLoader, setLoaderTargetBlock } = props;
  /**
   * image type의 block에 넣은 이미지 파일을 선택하기 위한 버튼을 클릭한 경우 작동하는 함수로, Loader component를 엶
   */
  const onClickAddFileBtn = useCallback(() => {
    setOpenLoader(true);
    setLoaderTargetBlock(block);
  }, [setOpenLoader, setLoaderTargetBlock, block]);

  return (
    <>
      {!block.contents ? (
        <button
          className="btn-addBlockFile"
          title="btn to add image"
          onClick={onClickAddFileBtn}
        >
          <ScreenOnly text="btn to add image" />
          <span className="icon-addBlockFile">
            <MdOutlinePhotoSizeSelectActual />
          </span>
          <span>
            Add a {props.block.type.slice(0, props.block.type.indexOf("media"))}
          </span>
        </button>
      ) : (
        <>
          <ImageContent
            page={props.page}
            block={props.block}
            editBlock={props.editBlock}
            measure={props.measure}
          />
        </>
      )}
    </>
  );
};

export default React.memo(ImageBlock);
