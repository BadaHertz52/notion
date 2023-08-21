import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from "react";
import { useSelector } from "react-redux";
import { CSSProperties } from "styled-components";
import Frame from "../components/Frame";
import MobileSideMenu from "../components/MobileSideMenu";
import TopBar from "../components/TopBar";
import { RootState } from "../modules";
import { Block, Page, ListItem } from "../modules/notion/type";
import { SideAppear } from "../modules/side/reducer";
import {
  ActionContext,
  FontStyleType,
  mobileSideMenuType,
  PathType,
} from "../route/NotionRouter";
import { makePagePath } from "../fn";
import "../assets/editor.scss";

export const modalMoveToPage = "modalMoveToPage";
export const modalComment = "modalComment";
export const modalCommand = "modalCommand";
export type ModalType = {
  open: boolean;
  what:
    | typeof modalMoveToPage
    | typeof modalComment
    | typeof modalCommand
    | null;
};

type EditorContainerProps = {
  pages: Page[];
  pagesId: string[];
  userName: string;
  firstList: ListItem[];
  recentPagesId: string[] | null;
  sideAppear: SideAppear;
  page: Page;
  isInTrash: boolean;
  modal: ModalType;
  setModal: Dispatch<SetStateAction<ModalType>>;
  openComment: boolean;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  commentBlock: Block | null;
  setCommentBlock: Dispatch<SetStateAction<Block | null>>;
  smallText: boolean;
  setSmallText: Dispatch<SetStateAction<boolean>>;

  fullWidth: boolean;
  setFullWidth: Dispatch<SetStateAction<boolean>>;
  showAllComments: boolean;
  setShowAllComments: Dispatch<SetStateAction<boolean>>;
  discardEdit: boolean;
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
  setOpenExport: Dispatch<SetStateAction<boolean>>;
  openTemplates: boolean;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
  fontStyle: FontStyleType;
  setFontStyle: Dispatch<SetStateAction<FontStyleType>>;
  mobileSideMenu: mobileSideMenuType;
  setMobileSideMenu: Dispatch<SetStateAction<mobileSideMenuType>>;
  openExport?: boolean;
};

const EditorContainer = ({
  sideAppear,
  userName,
  firstList,
  page,
  pages,
  pagesId,
  recentPagesId,
  isInTrash,
  openComment,
  setOpenComment,
  commentBlock,
  setCommentBlock,
  smallText,
  setSmallText,
  fullWidth,
  setFullWidth,
  showAllComments,
  setShowAllComments,
  discardEdit,
  setDiscardEdit,
  setOpenExport,
  openTemplates,
  setOpenTemplates,
  fontStyle,
  setFontStyle,
  modal,
  setModal,
  mobileSideMenu,
  setMobileSideMenu,
  openExport,
}: EditorContainerProps) => {
  const { restorePage, cleanTrash } = useContext(ActionContext).actions;
  const user = useSelector((state: RootState) => state.user);
  const [editorStyle, setEditorStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [pagePath, setPagePath] = useState<PathType[] | null>(null);

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
        firstList={firstList}
        favorites={user.favorites}
        sideAppear={sideAppear}
        page={page}
        pages={pages}
        pagePath={pagePath}
        showAllComments={showAllComments}
        setShowAllComments={setShowAllComments}
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
        commentBlock={commentBlock}
        openComment={openComment}
        setOpenComment={setOpenComment}
        setCommentBlock={setCommentBlock}
        modal={modal}
        setModal={setModal}
        showAllComments={showAllComments}
        smallText={smallText}
        fullWidth={fullWidth}
        discardEdit={discardEdit}
        setDiscardEdit={setDiscardEdit}
        openTemplates={openTemplates}
        setOpenTemplates={setOpenTemplates}
        fontStyle={fontStyle}
        mobileSideMenu={mobileSideMenu}
        setMobileSideMenu={setMobileSideMenu}
        openExport={openExport}
      />
      {mobileSideMenu.block && (
        <MobileSideMenu
          pages={pages}
          pagesId={pagesId}
          recentPagesId={recentPagesId}
          firstList={firstList}
          userName={userName}
          page={page}
          block={mobileSideMenu.block}
          setModal={setModal}
          modal={modal}
          setCommentBlock={setCommentBlock}
          frameHtml={null}
          mobileSideMenu={mobileSideMenu}
          setMobileSideMenu={setMobileSideMenu}
        />
      )}
    </div>
  );
};

export default React.memo(EditorContainer);
