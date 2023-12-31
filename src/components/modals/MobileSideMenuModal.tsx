import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ModalPortal from "./ModalPortal";
import { ModalTargetType, ModalType } from "../../types";
import { INITIAL_MODAL, SESSION_KEY } from "../../constants";
import { CSSProperties } from "styled-components";
import { FaArrowAltCircleDown } from "react-icons/fa";

type MobileSideMenuModalProps = {
  sideMenuModal: ModalType;
  setSideMenuModal: Dispatch<SetStateAction<ModalType>>;
  rightBtn?: ReactNode;
  children: ReactNode;
  handleAlert?: () => boolean;
};
const MobileSideMenuModal = ({ ...props }: MobileSideMenuModalProps) => {
  const { sideMenuModal, setSideMenuModal, handleAlert } = props;

  const topRef = useRef<HTMLDivElement>(null);

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
      case "allComments":
        return "Comments";
      case "templates":
        return "Templates";
      default:
        return "Menu";
    }
  };

  const closeSideMenu = useCallback(() => {
    setStyle(INITIAL_STYLE);
    setTimeout(() => {
      setSideMenuModal(INITIAL_MODAL);
    }, 1000);
  }, [setSideMenuModal, INITIAL_STYLE]);

  const handleCloseTemplates = useCallback(() => {
    if (handleAlert && !handleAlert()) {
      closeSideMenu();
    }
  }, [closeSideMenu, handleAlert]);

  const handleClose = useCallback(() => {
    sideMenuModal.target === "templates"
      ? handleCloseTemplates()
      : closeSideMenu();
  }, [sideMenuModal.target, handleCloseTemplates, closeSideMenu]);

  const changeStyle = useCallback(() => {
    if (style === INITIAL_STYLE) {
      const FULL_MENU: ModalTargetType[] = ["allComments", "templates"];
      const top =
        sideMenuModal.target && FULL_MENU.includes(sideMenuModal.target)
          ? "45px"
          : "20vh";
      setStyle({
        transform: `translateY(${top})`,
        height: `calc( 100vh - ${top})`,
      });
    }
  }, [INITIAL_STYLE, style, setStyle, sideMenuModal.target]);

  useEffect(() => {
    sideMenuModal.open ? changeStyle() : handleClose();

    topRef.current?.classList.toggle(
      "bg",
      sideMenuModal.target === "allComments"
    );
  }, [sideMenuModal.open, sideMenuModal.target, handleClose, changeStyle]);

  return (
    <ModalPortal
      id="modal-mobile-side-menu"
      isOpen={sideMenuModal.open}
      style={style}
    >
      <div id="mobile-side-menu">
        <div className="inner">
          <div ref={topRef} className="top">
            <button
              className="btn-close"
              title="button to close"
              onClick={handleClose}
            >
              <FaArrowAltCircleDown />
            </button>
            <div>{getTitle()}</div>

            {props.rightBtn}
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
