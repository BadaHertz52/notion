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

import { IconModal, PageIcon, ScreenOnly } from "./index";

import { ActionContext } from "../contexts";
import { Block, Page } from "../types";
import {
  setTemplateItem,
  closeModal,
  getEditTime,
  isInTarget,
  changeIconModalStyle,
} from "../utils";

import "../assets/rename.scss";

export type RenameProps = {
  currentPageId?: string;
  block?: Block;
  page: Page;
  renameStyle?: CSSProperties;
  setOpenRename?: Dispatch<SetStateAction<boolean>>;
  closeRename: () => void;
};

const Rename = ({
  currentPageId,
  block,
  page,
  renameStyle,
  setOpenRename,
  closeRename,
}: RenameProps) => {
  const { editPage, editBlock } = useContext(ActionContext).actions;

  const [openIconModal, setOpenIconModal] = useState<boolean>(false);
  const [iconModalStyle, setIconModalStyle] = useState<
    CSSProperties | undefined
  >(undefined);

  const onClickRenameIcon = (event: MouseEvent) => {
    setOpenIconModal(true);
    changeIconModalStyle(event, setIconModalStyle);
  };

  const changeTitle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const editTime = getEditTime();
      if (value !== page.header.title) {
        const templateHtml = document.getElementById("template");
        setTemplateItem(templateHtml, page);
        const renamedPage: Page = {
          ...page,
          header: {
            ...page.header,
            title: value,
          },
          editTime: editTime,
        };
        editPage(renamedPage.id, renamedPage);
        if (block && currentPageId) {
          const editedBlock: Block = {
            ...block,
            contents: value,
            editTime: editTime,
          };
          editBlock(currentPageId, editedBlock);
        }
      }
    },
    [block, currentPageId, editBlock, editPage, page]
  );

  return (
    <div id="rename" style={renameStyle}>
      <div className="inner">
        <button
          title="button to move page"
          className="rename__btn"
          onClick={onClickRenameIcon}
        >
          <PageIcon
            icon={page.header.icon}
            iconType={page.header.iconType}
            style={undefined}
          />
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
      {openIconModal && (
        <IconModal
          isOpen={openIconModal}
          page={page}
          currentPageId={currentPageId}
          block={block}
          style={iconModalStyle}
          closeIconModal={() => setOpenIconModal(false)}
        />
      )}
    </div>
  );
};

export default React.memo(Rename);
