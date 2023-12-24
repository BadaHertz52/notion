import { createContext } from "react";
import { ModalType } from "../types";

const ModalContext = createContext({
  changeModalState: (modal: ModalType) => {},
  changeBlockQuickMenuModal: ((modal: ModalType) => {}) || undefined,
});

export default ModalContext;
