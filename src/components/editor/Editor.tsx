import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from "react";
import { useSelector } from "react-redux";
import { CSSProperties } from "styled-components";

import { Frame, TopBar } from "../index";

import { ActionContext } from "../../contexts";
import { RootState } from "../../modules";
import {
  Block,
  Page,
  ListItem,
  SideAppear,
  FontStyle,
  Path,
} from "../../types/";
import { makePagePath } from "../../utils";

import "../../assets/editor.scss";

export type EditorProps = {
  pages: Page[];
  pagesId: string[];
  userName: string;
  firstList: ListItem[];
  recentPagesId: string[] | null;
  sideAppear: SideAppear;
  page: Page;
  isInTrash: boolean;
  smallText: boolean;
  setSmallText: Dispatch<SetStateAction<boolean>>;
  fullWidth: boolean;
  setFullWidth: Dispatch<SetStateAction<boolean>>;
  setOpenExport: Dispatch<SetStateAction<boolean>>;
  openTemplates: boolean;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
  fontStyle: FontStyle;
  setFontStyle: Dispatch<SetStateAction<FontStyle>>;
  openExport?: boolean;
};

const Editor = ({
  sideAppear,
  userName,
  firstList,
  page,
  pages,
  pagesId,
  recentPagesId,
  isInTrash,
  smallText,
  setSmallText,
  fullWidth,
  setFullWidth,
  setOpenExport,
  openTemplates,
  setOpenTemplates,
  fontStyle,
  setFontStyle,
  openExport,
}: EditorProps) => {
  const { restorePage, cleanTrash } = useContext(ActionContext).actions;
  const user = useSelector((state: RootState) => state.user);
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
        <div className="isInTrash">
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
        userName={userName}
        firstList={firstList}
        favorites={user.favorites}
        sideAppear={sideAppear}
        page={page}
        pages={pages}
        pagePath={pagePath}
        smallText={smallText}
        setSmallText={setSmallText}
        fullWidth={fullWidth}
        setFullWidth={setFullWidth}
        setOpenExport={setOpenExport}
        setFontStyle={setFontStyle}
      />
      <Frame
        page={page}
        userName={userName}
        pagesId={pagesId}
        pages={pages}
        firstList={firstList}
        recentPagesId={recentPagesId}
        smallText={smallText}
        fullWidth={fullWidth}
        openTemplates={openTemplates}
        setOpenTemplates={setOpenTemplates}
        fontStyle={fontStyle}
        openExport={openExport}
      />
    </div>
  );
};

export default React.memo(Editor);
