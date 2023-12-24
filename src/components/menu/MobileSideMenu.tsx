import React, { Dispatch, SetStateAction } from "react";

import {
  ColorMenu,
  CommandMenu,
  LinkLoader,
  MobileSideMenuModal,
  PageMenu,
} from "../index";
import { MenuAndBlockStylerCommonProps, ModalType } from "../../types";

import "../../assets/mobileSideMenu.scss";

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
  const closeSideMenu = () =>
    setSideMenuModal((prev) => ({ ...prev, open: false }));

  return (
    <MobileSideMenuModal
      sideMenuModal={sideMenuModal}
      setSideMenuModal={setSideMenuModal}
    >
      {sideMenuModal.target === "color" && (
        <ColorMenu page={page} block={block} closeMenu={closeSideMenu} />
      )}
      {sideMenuModal.target === "command" && (
        <CommandMenu page={page} block={block} closeCommand={closeSideMenu} />
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
          block={block}
          firstList={firstList}
          closeMenu={closeSideMenu}
        />
      )}
    </MobileSideMenuModal>
  );
};

export default React.memo(MobileSideMenu);
