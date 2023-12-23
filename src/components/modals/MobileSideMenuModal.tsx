import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import ModalPortal from "./ModalPortal";
import { ModalType } from "../../types";
import { INITIAL_MODAL } from "../../constants";
import { CSSProperties } from "styled-components";

type MobileSideMenuModalProps = {
  sideMenuModal: ModalType;
  setSideMenuModal: Dispatch<SetStateAction<ModalType>>;
  children: ReactNode;
};
const MobileSideMenuModal = ({ ...props }: MobileSideMenuModalProps) => {
  const { sideMenuModal, setSideMenuModal } = props;

  const INITIAL_STYLE: CSSProperties = {
    transform: "translateY(110vh)",
  };

  const [style, setStyle] = useState<CSSProperties>(INITIAL_STYLE);

  const getTitle = () => {
    switch (sideMenuModal.target) {
      case "color":
        return "Color";
      case "menu":
        return "Menu";
      case "command":
        return "Turn into";
      case "linkLoader":
        return "Link";
      default:
        return "Menu";
    }
  };

  const closeSideMenu = useCallback(() => {
    console.log("close");
    setStyle(INITIAL_STYLE);
    setTimeout(() => {
      setSideMenuModal(INITIAL_MODAL);
    }, 1000);
  }, [setSideMenuModal, INITIAL_STYLE]);

  const changeStyle = () => {
    if (style === INITIAL_STYLE) {
      setStyle({
        transform: "translateY(20vh)",
      });
    }
  };
  useEffect(() => {
    sideMenuModal.open ? changeStyle() : closeSideMenu();
  }, [sideMenuModal.open, closeSideMenu]);

  return (
    <ModalPortal
      id="modal-mobile-side-menu"
      isOpen={sideMenuModal.open}
      style={style}
    >
      <div id="mobile-side-menu">
        <div className="inner">
          <div className="top">
            <div>{getTitle()}</div>
            <button title="button to close" onClick={closeSideMenu}>
              close
            </button>
          </div>
          <div className="contents">
            <div className="contents__inner">{props.children}</div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default MobileSideMenuModal;
