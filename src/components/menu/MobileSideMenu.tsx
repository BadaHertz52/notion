import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CSSProperties } from "styled-components";

import {
  ColorMenu,
  CommandMenu,
  LinkLoader,
  Menu,
  ModalPortal,
  PageMenu,
} from "../index";
import { MenuAndBlockStylerCommonProps, ModalType } from "../../types";

import "../../assets/mobileSideMenu.scss";
import { INITIAL_MODAL } from "../../constants";

export type MobileSideMenuProps = Omit<
  MenuAndBlockStylerCommonProps,
  "userName" | "frameHtml"
> & {
  recentPagesId: string[] | null;
  pagesId: string[];
  sideMenuModal: ModalType;
  setSideMenuModal: Dispatch<SetStateAction<ModalType>>;
};
const MobileSideMenu = ({
  pages,
  pagesId,
  recentPagesId,
  firstList,
  block,
  page,
  sideMenuModal,
  setSideMenuModal,
}: MobileSideMenuProps) => {
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
  const closeSideMenu = () => {
    setStyle(INITIAL_STYLE);
    setTimeout(() => {
      setSideMenuModal(INITIAL_MODAL);
    }, 1000);
  };

  useEffect(() => {
    setStyle({
      transform: "translateY(20vh)",
    });
  }, [sideMenuModal]);

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
            <div className="contents__inner">
              {sideMenuModal.target === "color" && (
                <ColorMenu
                  page={page}
                  block={block}
                  closeMenu={closeSideMenu}
                />
              )}
              {sideMenuModal.target === "command" && (
                <CommandMenu
                  page={page}
                  block={block}
                  closeCommand={closeSideMenu}
                />
              )}
              {sideMenuModal.target === "linkLoader" && (
                <LinkLoader
                  recentPagesId={recentPagesId}
                  pages={pages}
                  pagesId={pagesId}
                  page={page}
                  block={block}
                  closeLink={closeSideMenu}
                />
              )}
              {sideMenuModal.target === "pageMenu" && (
                <PageMenu
                  what="block"
                  currentPage={page}
                  pages={pages}
                  firstList={firstList}
                  closeMenu={closeSideMenu}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default React.memo(MobileSideMenu);
