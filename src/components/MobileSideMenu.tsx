import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CSSProperties } from "styled-components";
import { mobileSideMenuType } from "../containers/NotionRouter";
import ColorMenu from "./ColorMenu";
import CommandBlock from "./CommandBlock";
import { selectionType } from "../containers/NotionRouter";
import LinkLoader from "./LinkLoader";

import Menu, { MenuAndBlockStylerCommonProps } from "./Menu";

type MobileSideMenuProps = MenuAndBlockStylerCommonProps & {
  recentPagesId: string[] | null;
  pagesId: string[];
  mobileSideMenu: mobileSideMenuType;
  setMobileSideMenu: Dispatch<SetStateAction<mobileSideMenuType>>;
  mobileSideMenuOpen: boolean;
  setMobileSideMenuOpen: Dispatch<SetStateAction<boolean>>;
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
  setTargetPageId,
  frameHtml,
  mobileSideMenu,
  setMobileSideMenu,
  mobileSideMenuOpen,
  setMobileSideMenuOpen,
}: MobileSideMenuProps) => {
  const mobileSelection: selectionType | null =
    document.querySelector(".selected") == null
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
    setMobileSideMenu({
      block: null,
      what: undefined,
    });
    setMobileSideMenuOpen(false);
  };
  useEffect(() => {
    if (!mobileSideMenuOpen) {
      setMobileSideMenu({
        block: null,
        what: undefined,
      });
      setMobileSideMenuStyle({
        transform: "translateY(110%)",
      });
    } else {
      setMobileSideMenuStyle({ transform: "translateY(0)" });
    }
  }, [mobileSideMenuOpen]);
  return (
    <div id="mobileSideMenu" style={mobileSideMenuStyle}>
      <div className="inner">
        <div className="top">
          <div>{getTitle()}</div>
          <button onClick={closeSideMenu}>close</button>
        </div>
        <div className="contents">
          {mobileSideMenu.what === "ms_moreMenu" && (
            <Menu
              pages={pages}
              block={block}
              firstList={firstList}
              page={page}
              userName={userName}
              setOpenMenu={setMobileSideMenuOpen}
              modal={modal}
              setModal={setModal}
              setCommentBlock={setCommentBlock}
              setTargetPageId={setTargetPageId}
              setOpenRename={null}
              setSelection={null}
              frameHtml={frameHtml}
              style={undefined}
            />
          )}
          {mobileSideMenu.what === "ms_color" && (
            <ColorMenu
              page={page}
              block={block}
              selection={mobileSelection}
              setSelection={null}
              setOpenMenu={setMobileSideMenuOpen}
            />
          )}
          {mobileSideMenu.what === "ms_turnInto" && (
            <CommandBlock
              style={undefined}
              page={page}
              block={block}
              command={null}
              setCommand={null}
              setTurnInto={setMobileSideMenuOpen}
              setSelection={null}
            />
          )}
          {mobileSideMenu.what === "ms_link" && (
            <LinkLoader
              recentPagesId={recentPagesId}
              pages={pages}
              pagesId={pagesId}
              page={page}
              block={block}
              setOpenLink={setMobileSideMenuOpen}
              blockStylerStyle={undefined}
              setSelection={null}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileSideMenu);
