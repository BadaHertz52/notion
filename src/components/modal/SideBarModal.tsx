import React, {
  Dispatch,
  SetStateAction,
  TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { CSSProperties } from "styled-components";

import {
  ModalPortal,
  Rename,
  SideBarMoreFn,
  ScreenOnly,
  PageMenu,
} from "../index";

import { INITIAL_MODAL } from "../../constants";
import { ListItem, ModalType, Page, UserState } from "../../types";
import { findPage, isInTarget } from "../../utils";

type SideBarModalProps = {
  user: UserState;
  targetItem: ListItem | null;
  sideModal: ModalType;
  setSideModal: Dispatch<SetStateAction<ModalType>>;
  pages: Page[];
  pagesId: string[];
  firstList: ListItem[];
};
const SideBarModal = ({ ...props }: SideBarModalProps) => {
  const { sideModal, setSideModal, pages, pagesId } = props;

  const touchResizeBar = useRef<boolean>(false);
  const [modalStyle, setModalStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [innerStyle, setInnerStyle] = useState<CSSProperties | undefined>(
    undefined
  );

  const closeModalInMobile = useCallback(() => {
    setModalStyle((prev) => ({ ...prev, top: "100vh" }));

    setTimeout(() => {
      setSideModal(INITIAL_MODAL);
    }, 1000);
  }, [setModalStyle, setSideModal]);

  const closeModal = useCallback(() => {
    sideModal.isMobile ? closeModalInMobile() : setSideModal(INITIAL_MODAL);
  }, [sideModal.isMobile, setSideModal, closeModalInMobile]);

  const onTouchStartResizeBar = useCallback(() => {
    touchResizeBar.current = true;
  }, []);

  const onTouchMoveSideBar = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (touchResizeBar.current) {
        const clientY = event.changedTouches[0].clientY;
        const innerHeight = window.innerHeight;
        if (innerHeight * 0.9 <= clientY) {
          closeModal();
          touchResizeBar.current = false;
        } else {
          clientY >= 120 &&
            setInnerStyle({
              top: clientY,
            });
        }
      }
    },
    [setInnerStyle, closeModal]
  );

  const changeStyleInWeb = useCallback(() => {
    const { targetDomRect } = sideModal;

    if (targetDomRect) {
      const { top, left, right } = targetDomRect;
      switch (sideModal.target) {
        case "sideBarMoreFn":
          setModalStyle({
            position: "absolute",
            top: top,
            left: right,
          });
          break;
        case "pageMenu":
          setModalStyle({
            position: "absolute",
            top: top,
            left: left,
          });
          break;
        case "rename":
          const el = document.querySelector(".item__inner.page-link");
          if (el) {
            setModalStyle({
              position: "absolute",
              top: top + el.clientHeight,
              left: el.clientLeft + 16,
            });
          }

          break;
        default:
          break;
      }
    }
  }, [sideModal]);
  const changeStyleForMobileMenu = useCallback(() => {
    setModalStyle((prev) => ({
      ...prev,
      top: 0,
    }));
    setInnerStyle({
      position: "absolute",
      top: "50vh",
      left: 0,
    });
  }, [setModalStyle, setInnerStyle]);

  const changeStyleForMobileForMoreFn = useCallback(() => {
    setModalStyle({
      position: "absolute",
      top: "110vh",
      left: 0,
    });
    setTimeout(() => {
      changeStyleForMobileMenu();
    }, 500);
  }, [changeStyleForMobileMenu]);

  const changeStyleInMobile = useCallback(() => {
    sideModal.target === "sideBarMoreFn"
      ? changeStyleForMobileForMoreFn()
      : changeStyleForMobileMenu();
  }, [
    sideModal?.target,
    changeStyleForMobileForMoreFn,
    changeStyleForMobileMenu,
  ]);

  const handleCloseModal = useCallback(
    (event: globalThis.MouseEvent) => {
      if (
        !isInTarget(event, "#sideBarModal__menu") &&
        !isInTarget(event, ".sideBarPageFn") &&
        !isInTarget(event, "#sideBar__moreFn")
      ) {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    sideModal.isMobile ? changeStyleInMobile() : changeStyleInWeb();
  }, [sideModal, changeStyleInMobile, changeStyleInWeb]);

  useEffect(() => {
    sideModal.open
      ? window.addEventListener("click", handleCloseModal)
      : window.removeEventListener("click", handleCloseModal);
  }, [handleCloseModal, sideModal.open]);

  return (
    <ModalPortal
      id="sideBarModal"
      isOpen={sideModal.open}
      onTouchMove={onTouchMoveSideBar}
      style={modalStyle}
    >
      <div className="inner" style={innerStyle}>
        {/*mobile ---*/}
        {sideModal.isMobile && (
          <div className="topBar">
            <button
              title="button to resize sideBar__moreFn "
              className="resizeBar"
              onTouchStart={onTouchStartResizeBar}
            >
              <ScreenOnly text="button to resize sideBar__moreFn" />
              <div></div>
            </button>
            <button className="btn-close" onClick={closeModalInMobile}>
              close
            </button>
          </div>
        )}
        {/*---mobile*/}
        {sideModal.target === "sideBarMoreFn" && (
          <SideBarMoreFn {...props} closeModal={closeModal} />
        )}
        {sideModal.target === "pageMenu" && sideModal.pageId && (
          <PageMenu
            {...props}
            what="page"
            currentPage={findPage(pagesId, pages, sideModal.pageId)}
            closeMenu={closeModal}
          />
        )}
        {sideModal.target === "rename" && sideModal.pageId && (
          <Rename
            currentPageId={null}
            block={null}
            page={findPage(pagesId, pages, sideModal.pageId)}
            closeRename={closeModal}
          />
        )}
      </div>
    </ModalPortal>
  );
};

export default React.memo(SideBarModal);
