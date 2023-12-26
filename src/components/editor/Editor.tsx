import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from "react";

import { CSSProperties } from "styled-components";

import { ExportModal, Frame, TopBar } from "../index";

import { ActionContext } from "../../contexts";

import {
  Page,
  ListItem,
  SideAppear,
  FontStyle,
  Path,
  ModalType,
} from "../../types/";
import { makePagePath } from "../../utils";

import "../../assets/editor.scss";
import { INITIAL_MODAL } from "../../constants";

export type EditorProps = {
  pages: Page[];
  pagesId: string[];
  userName: string;
  favorites: string[] | null;
  firstList: ListItem[];
  recentPagesId: string[] | null;
  sideAppear: SideAppear;
  page: Page;
  isInTrash: boolean;
  smallText: boolean;
  setSmallText: Dispatch<SetStateAction<boolean>>;
  fullWidth: boolean;
  setFullWidth: Dispatch<SetStateAction<boolean>>;
  fontStyle: FontStyle;
  setFontStyle: Dispatch<SetStateAction<FontStyle>>;
  openTemplates: () => void;
};

const Editor = ({ ...props }: EditorProps) => {
  const { sideAppear, pages, pagesId, page, isInTrash } = props;

  const { restorePage, cleanTrash } = useContext(ActionContext).actions;

  const [exportModal, setExportModal] = useState<ModalType>(INITIAL_MODAL);

  const [editorStyle, setEditorStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [pagePath, setPagePath] = useState<Path[] | null>(null);

  useEffect(() => {
    if (sideAppear === "lock") {
      const sideBarHtml = document.querySelector(".sideBar");
      const sideBarWidth = sideBarHtml?.clientWidth;
      if (sideBarWidth) {
        setEditorStyle({
          width: `calc(100vw - ${sideBarWidth}px)`,
        });
      }
    } else {
      setEditorStyle({
        width: "100vw",
      });
    }
  }, [sideAppear]);

  useEffect(() => {
    setPagePath(makePagePath(page, pagesId, pages));
  }, [page, page.header.icon, page.header.title, pages, pagesId]);

  return (
    <div className="editor" style={editorStyle}>
      {isInTrash && (
        <div className="editor-in-trash">
          <div>This is page is in Trash.</div>
          <div className="isInTrash__btn-group">
            <button
              title="button to restore page"
              onClick={() => restorePage(page.id)}
            >
              Restore page
            </button>
            <button
              title="button to delete page  permanently "
              onClick={() => cleanTrash(page.id)}
            >
              Delete permanently
            </button>
          </div>
        </div>
      )}
      <TopBar
        {...props}
        pagePath={pagePath}
        openExportModal={() => setExportModal({ open: true, target: "export" })}
      />
      <Frame {...props} isExport={exportModal.open} />
      {exportModal.open && (
        <ExportModal
          {...props}
          closeModal={() => setExportModal(INITIAL_MODAL)}
        />
      )}
    </div>
  );
};

export default React.memo(Editor);
