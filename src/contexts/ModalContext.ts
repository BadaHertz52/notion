import { createContext } from "react";
import { ModalType } from "../types";

export const ModalContext = createContext({
  changeModal: (newModal?: ModalType) => {},
});
