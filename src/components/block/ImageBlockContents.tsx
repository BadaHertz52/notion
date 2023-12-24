import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";

import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";

import { ImageBox, LoaderModal, ScreenOnly } from "../index";
import { ImageBoxProps } from "./ImageBox";

type ImageBlockContentsProps = ImageBoxProps;

const ImageBlockContents = ({ ...props }: ImageBlockContentsProps) => {
  const { block } = props;

  const [openModal, setOpenModal] = useState<boolean>(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const closeModal = () => setOpenModal(false);

  const onClickAddFileBtn = useCallback(() => {
    setOpenModal(true);
  }, [setOpenModal]);

  return (
    <>
      {!block.contents ? (
        <button
          ref={btnRef}
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
        <ImageBox
          page={props.page}
          block={props.block}
          editBlock={props.editBlock}
          measure={props.measure}
        />
      )}
      {openModal && (
        <LoaderModal
          {...props}
          block={block}
          isOpen={openModal}
          targetRef={btnRef}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default React.memo(ImageBlockContents);
