import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CSSProperties } from "styled-components";

import { ColorMenu, CommandMenu, LinkLoader, Menu, PageMenu } from "../index";
import {
  MobileSideMenuType,
  MenuAndBlockStylerCommonProps,
  SelectionType,
} from "../../types";

import "../../assets/mobileSideMenu.scss";

type MobileSideMenuProps = MenuAndBlockStylerCommonProps & {
  recentPagesId: string[] | null;
  pagesId: string[];
  mobileSideMenu: MobileSideMenuType;
  setMobileSideMenu: Dispatch<SetStateAction<MobileSideMenuType>>;
};
const MobileSideMenu = ({
  pages,
  pagesId,
  recentPagesId,
  firstList,
  block,
  userName,
  page,
  setModal,
  modal,
  setCommentBlock,
  frameHtml,
  mobileSideMenu,
  setMobileSideMenu,
}: MobileSideMenuProps) => {
  const mobileSelection: SelectionType | null =
    document.querySelector(".selected") === null
      ? null
      : {
          block: block,
          change: false,
        };
  const [mobileSideMenuStyle, setMobileSideMenuStyle] = useState<CSSProperties>(
    { transform: "translateY(110vh" }
  );
  const getTitle = () => {
    switch (mobileSideMenu.what) {
      case "ms_color":
        return "Color";
      case "ms_moreMenu":
        return "Menu";
      case "ms_turnInto":
        return "Turn into";
      default:
        return "Menu";
    }
  };
  const closeSideMenu = () => {
    setMobileSideMenuStyle({
      transform: "translateY(110%)",
    });
    setTimeout(() => {
      setMobileSideMenu({
        what: undefined,
        block: null,
      });
    }, 1000);
  };
  useEffect(() => {
    if (!mobileSideMenu.what) {
      setMobileSideMenuStyle({
        transform: "translateY(110%)",
      });
    } else {
      setMobileSideMenuStyle({ transform: "translateY(0)" });
    }
  }, [mobileSideMenu]);
  return (
    <div id="mobileSideMenu" style={mobileSideMenuStyle}>
      <div className="inner">
        <div className="top">
          <div>{getTitle()}</div>
          <button title="button to close" onClick={closeSideMenu}>
            close
          </button>
        </div>
        <div className="contents">
          {mobileSideMenu.what === "ms_moreMenu" && (
            <Menu
              pages={pages}
              block={block}
              firstList={firstList}
              page={page}
              userName={userName}
              modal={modal}
              setModal={setModal}
              setCommentBlock={setCommentBlock}
              setOpenRename={null}
              frameHtml={frameHtml}
              style={undefined}
              setMobileSideMenu={setMobileSideMenu}
            />
          )}
          {mobileSideMenu.what === "ms_color" && (
            <ColorMenu
              page={page}
              block={block}
              selection={mobileSelection}
              closeMenu={closeSideMenu}
            />
          )}
          {mobileSideMenu.what === "ms_turnInto" && (
            <CommandMenu
              style={undefined}
              page={page}
              block={block}
              command={null}
              setCommand={null}
              closeCommand={closeSideMenu}
            />
          )}
          {mobileSideMenu.what === "ms_link" && (
            <LinkLoader
              recentPagesId={recentPagesId}
              pages={pages}
              pagesId={pagesId}
              page={page}
              block={block}
              closeLink={closeSideMenu}
              blockStylerStyle={undefined}
            />
          )}
          {mobileSideMenu.what === "ms_movePage" && (
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
  );
};

export default React.memo(MobileSideMenu);
