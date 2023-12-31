import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
  useCallback,
  MouseEvent,
} from "react";

import { CSSProperties } from "styled-components";

import { IconMenu, IconModal, PageIcon, ScreenOnly } from "./index";

import { ActionContext } from "../contexts";
import { Block, Page } from "../types";
import {
  setOriginTemplateItem,
  getEditTime,
  changeIconModalStyle,
  findPage,
} from "../utils";

import "../assets/rename.scss";

export type RenameProps = {
  pages: Page[];
  pagesId: string[];
  currentPageId?: string;
  block?: Block;
  page: Page;
  renameStyle?: CSSProperties;
};

const Rename = ({
  currentPageId,
  block,
  pages,
  pagesId,
  page,
  renameStyle,
}: RenameProps) => {
  const { editPage, editBlock } = useContext(ActionContext).actions;

  const [openIconModal, setOpenIconModal] = useState<boolean>(false);
  const [iconModalStyle, setIconModalStyle] = useState<
    CSSProperties | undefined
  >(undefined);

  const onClickRenameIcon = (event: MouseEvent) => {
    setOpenIconModal(true);
    if (!event.currentTarget.closest("#modal-sideBar__menu"))
      changeIconModalStyle(event, setIconModalStyle);
  };

  const changeTitle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const editTime = getEditTime();
      const {
        header: { icon, iconType },
      } = findPage(pagesId, pages, page.id);

      if (value !== page.header.title) {
        setOriginTemplateItem(page);
        const renamedPage: Page = {
          ...page,
          header: {
            ...page.header,
            iconType: iconType,
            icon: icon,
            title: value,
          },
          editTime: editTime,
        };
        editPage(renamedPage.id, renamedPage);
        if (block && currentPageId) {
          const editedBlock: Block = {
            ...block,
            iconType: iconType,
            icon: icon,
            contents: value,
            editTime: editTime,
          };
          editBlock(currentPageId, editedBlock);
        }
      }
    },
    [block, currentPageId, editBlock, editPage, page, pages]
  );

  const closeIconModal = () => setOpenIconModal(false);

  return (
    <div id="rename" style={renameStyle}>
      <div className="inner">
        <button
          title="button to move page"
          className="rename__btn"
          onClick={onClickRenameIcon}
        >
          <PageIcon icon={page.header.icon} iconType={page.header.iconType} />
        </button>
        <label>
          <ScreenOnly text="input to rename " />
          <input
            className="rename__title"
            title="input to rename "
            onChange={changeTitle}
            type="text"
            value={page.header.title}
          />
        </label>
      </div>
      {openIconModal &&
        (iconModalStyle ? (
          <IconModal
            isOpen={openIconModal}
            page={page}
            currentPageId={currentPageId}
            block={block}
            style={iconModalStyle}
            closeIconModal={closeIconModal}
          />
        ) : (
          <IconMenu
            page={page}
            currentPageId={currentPageId}
            block={block}
            closeIconModal={closeIconModal}
          />
        ))}
    </div>
  );
};

export default React.memo(Rename);
