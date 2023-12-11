import React, {
  Dispatch,
  SetStateAction,
  TouchEvent,
  useCallback,
  useContext,
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
  QuickFindBoard,
  Templates,
  Trash,
} from "../index";

import { INITIAL_MODAL } from "../../constants";
import {
  ListItem,
  ModalType,
  ModalTypeTarget,
  Page,
  TrashPage,
  UserState,
} from "../../types";
import { findPage, isInTarget } from "../../utils";
import { ActionContext } from "../../contexts";

type SideBarModalProps = {
  user: UserState;
  targetItem: ListItem | null;
  sideModal: ModalType;
  setSideModal: Dispatch<SetStateAction<ModalType>>;
  pages: Page[];
  pagesId: string[];
  firstList: ListItem[];
  trash: {
    pagesId: string[] | null;
    pages: TrashPage[] | null;
  };
};
const SideBarModal = ({ ...props }: SideBarModalProps) => {
  const { cleanRecentPage } = useContext(ActionContext).actions;

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
          const el = document.querySelector(".pageList__item.link-page");
          if (el) {
            setModalStyle({
              position: "absolute",
              top: top + el.clientHeight,
              left: el.clientLeft + 16,
            });
          }
          break;
        default:
          //quickFind, trash, template
          setModalStyle({
            top: 0,
            left: 0,
          });
          setInnerStyle({
            width: "100%",
            position: "absolute",
          });
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
      const NOT_TARGET_ARRAY = [
        "#modal-sideBar__menu",
        ".pageList__item__btn-group",
        "#sideBar__moreFn",
        "#btn-open-quickFindBoard",
        ".btn-trash",
      ];

      const isClose = NOT_TARGET_ARRAY.map((v) => isInTarget(event, v)).every(
        (v) => !v
      );

      if (isClose) closeModal();
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

  useEffect(() => {
    console.log(sideModal);
  }, [sideModal]);
  return (
    <ModalPortal
      target={sideModal.target}
      id="modal-sideBar"
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
              className="btn-resize"
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
        {sideModal.target === "quickFind" && (
          <QuickFindBoard
            {...props}
            userName={props.user.userName}
            recentPagesId={props.user.recentPagesId}
            cleanRecentPage={cleanRecentPage}
          />
        )}
        {/* //TODO - frame 모달 수정 이후에 수정 */}
        {/* {sideModal.target === "templates" && (
          <Templates
            routePageId={currentPage.id}
            user={user}
            userName={user.userName}
            pagesId={pagesId}
            pages={pages}
            firstList={firstList}
            recentPagesId={user.recentPagesId}
            commentBlock={null}
            openComment={openComment}
            setOpenComment={setOpenComment}
            openTemplates={openTemplates}
            setOpenTemplates={setOpenTemplates}
            setCommentBlock={setCommentBlock}
            showAllComments={showAllComments}
            smallText={smallText}
            fullWidth={fullWidth}
            discardEdit={discard_edit}
            setDiscardEdit={setDiscardEdit}
            fontStyle={fontStyle}
            mobileSideMenu={mobileSideMenu}
            setMobileSideMenu={setMobileSideMenu}
          />
        )} */}
        {sideModal.target === "trash" && (
          <Trash
            trashPagesId={props.trash.pagesId}
            trashPages={props.trash.pages}
            pagesId={pagesId}
            pages={pages}
            closeTrash={closeModal}
          />
        )}
      </div>
    </ModalPortal>
  );
};

export default React.memo(SideBarModal);
