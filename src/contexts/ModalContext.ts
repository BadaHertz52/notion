import { createContext } from "react";
import { ModalType } from "../types";

const ModalContext = createContext({
  changeModalState: (modal: ModalType) => {},
});

export default ModalContext;
