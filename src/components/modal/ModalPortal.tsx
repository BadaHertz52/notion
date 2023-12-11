import React, {
  ReactNode,
  CSSProperties,
  TouchEvent,
  useRef,
  useEffect,
} from "react";
import * as ReactDOM from "react-dom";

import "../../assets/modal.scss";
import { ModalTypeTarget } from "../../types";

type ModalPortalProps = {
  target?: ModalTypeTarget;
  id?: string;
  isOpen: boolean;
  children: ReactNode;
  style?: CSSProperties;
  onTouchMove?: (event: TouchEvent<HTMLDivElement>) => void;
};
const ModalPortal = ({
  target,
  id,
  isOpen,
  children,
  style,
  onTouchMove,
}: ModalPortalProps) => {
  const modalRootEl = document.getElementById("modal-root") as HTMLElement;
  const modalRef = useRef<HTMLDivElement>(null);
  const CENTER_TARGET_ARRAY: ModalTypeTarget[] = ["quickFind", "trash"];
  const isCenter: boolean = target
    ? CENTER_TARGET_ARRAY.includes(target)
    : false;

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.classList.toggle("on", isOpen);
      modalRef.current.classList.toggle("center", isCenter);
    }
  }, [isOpen, isCenter]);

  return ReactDOM.createPortal(
    <div id={id} ref={modalRef} className="modal" onTouchMove={onTouchMove}>
      <div className="inner">
        <div id={`${id}__menu`} className="modal__menu" style={style}>
          {children}
        </div>
      </div>
    </div>,
    modalRootEl
  );
};

export default React.memo(ModalPortal);
