import React, { ReactNode, CSSProperties } from "react";
import * as ReactDOM from "react-dom";

import "../assets/modal.scss";

type ModalProps = {
  id?: string;
  isOpen: boolean;
  children: ReactNode;
  style?: CSSProperties;
};
const Modal = ({ id, isOpen, children, style }: ModalProps) => {
  const modalRootEl = document.getElementById("modal-root") as HTMLElement;
  return ReactDOM.createPortal(
    <div id={id} className={`modal ${isOpen ? "on" : ""}`}>
      <div className="inner">
        <div style={style}>{children}</div>
      </div>
    </div>,
    modalRootEl
  );
};

export default React.memo(Modal);
