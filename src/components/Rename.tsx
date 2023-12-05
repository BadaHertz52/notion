import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";

import { CSSProperties } from "styled-components";

import { IconModal, PageIcon, ScreenOnly } from "./index";

import { ActionContext } from "../contexts";
import { Block, Page } from "../types";
import { setTemplateItem, closeModal, getEditTime, isInTarget } from "../utils";

import "../assets/rename.scss";

export type RenameProps = {
  currentPageId: string | null;
  block: Block | null;
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
  const inner = document.getElementById("inner");
  const [openIconModal, setOpenIconModal] = useState<boolean>(false);
  //TODO -  이모지 모달
  const handleClick = useCallback(
    (event: globalThis.MouseEvent) => {
      if (document.getElementById("rename")) {
        const isInEmojiModal = isInTarget(event, undefined, "modal");
        if (!isInTarget(event, "rename") || !isInEmojiModal) closeRename();
        openIconModal && closeModal("iconModal", setOpenIconModal, event);
        closeRename();
        //setOpenRename && closeModal("rename", setOpenRename, event);
      }
    },
    [openIconModal, setOpenRename]
  );

  const onClickRenameIcon = () => {
    setOpenIconModal(true);
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

  useEffect(() => {
    inner?.addEventListener("click", handleClick);
    return () => {
      inner?.removeEventListener("click", handleClick);
    };
  }, [inner, handleClick]);

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
          page={page}
          currentPageId={currentPageId}
          block={block}
          style={undefined}
          setOpenIconModal={setOpenIconModal}
        />
      )}
    </div>
  );
};

export default React.memo(Rename);
