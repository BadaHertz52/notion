import React, {
  CSSProperties,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from "react";

import { Loader, ModalPortal } from "../index";
import { LoaderProps } from "../Loader";
import { useModal } from "../../hooks";

type LoaderModalProps = LoaderProps & {
  targetRef: RefObject<HTMLButtonElement>;
  isOpen: boolean;
};
const LoaderModal = ({ ...props }: LoaderModalProps) => {
  const { closeModal } = props;

  const CORRECT_TARGETS = [".btn-change-cover", "#loader", ".btn-addBlockFile"];
  const modalOpen = useModal(CORRECT_TARGETS, "loader");
  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);
  const GAP = 10;
  const changeBlockImageLoaderStyle = useCallback(() => {
    const targetDomRect = props.targetRef?.current?.getClientRects()[0];
    if (targetDomRect) {
      const LOADER_HEIGHT = 125;
      // loader를 targetRef 아래에 두었을 경우 bottom 좌표
      const bottom = targetDomRect.bottom + LOADER_HEIGHT + GAP;
      const isOver = window.innerHeight - bottom <= GAP * 3;

      setStyle({
        position: "absolute",
        left: targetDomRect.left,
        top: isOver
          ? targetDomRect.top - LOADER_HEIGHT - GAP
          : targetDomRect.bottom + GAP,
        maxHeight: LOADER_HEIGHT,
      });
    }
  }, [props.targetRef]);

  const changePageCoverLoaderStyle = useCallback(() => {
    const coverEl = props.targetRef?.current?.closest(".page__header__cover");
    const domRect = coverEl?.getClientRects()[0];

    if (domRect) {
      setStyle({
        position: "absolute",
        top: domRect.bottom + GAP,
        left: domRect.left + ~~(domRect.width / 3),
      });
    }
  }, [props.targetRef]);

  useEffect(() => {
    if (props.isOpen)
      props.block
        ? changeBlockImageLoaderStyle()
        : changePageCoverLoaderStyle();
  }, [
    props.isOpen,
    props.block,
    changeBlockImageLoaderStyle,
    changePageCoverLoaderStyle,
  ]);

  useEffect(() => {
    if (modalOpen.loader === false) closeModal();
  }, [modalOpen.loader, closeModal]);

  return (
    <ModalPortal id="modal-loader" isOpen={props.isOpen}>
      {props.isOpen && <Loader {...props} block={props.block} style={style} />}
    </ModalPortal>
  );
};

export default React.memo(LoaderModal);
