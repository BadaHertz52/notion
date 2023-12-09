import React, { ReactNode, CSSProperties, TouchEvent } from "react";
import * as ReactDOM from "react-dom";

import "../../assets/modal.scss";

type ModalPortalProps = {
  id?: string;
  isOpen: boolean;
  children: ReactNode;
  style?: CSSProperties;
  onTouchMove?: (event: TouchEvent<HTMLDivElement>) => void;
};
const ModalPortal = ({
  id,
  isOpen,
  children,
  style,
  onTouchMove,
}: ModalPortalProps) => {
  const modalRootEl = document.getElementById("modal-root") as HTMLElement;
  return ReactDOM.createPortal(
    <div
      id={id}
      className={`modal ${isOpen ? "on" : ""}`}
      onTouchMove={onTouchMove}
    >
      <div className="inner">
        <div id={`${id}__menu`} style={style}>
          {children}
        </div>
      </div>
    </div>,
    modalRootEl
  );
};

export default React.memo(ModalPortal);
