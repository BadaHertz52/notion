import React, { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";

import { Editor } from "../index";

import { RootState } from "../../modules";
import {
  Block,
  Page,
  ListItem,
  FontStyleType,
  MobileSideMenuType,
  ModalType,
} from "../../types";

type EditorProps = {
  pages: Page[];
  pagesId: string[];
  firstList: ListItem[];
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
  mobileSideMenu: MobileSideMenuType;
  setMobileSideMenu: Dispatch<SetStateAction<MobileSideMenuType>>;
  openExport?: boolean;
};

const EditorContainer = ({
  firstList,
  page,
  pages,
  pagesId,
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
}: EditorProps) => {
  const user = useSelector((state: RootState) => state.user);
  const sideAppear = useSelector((state: RootState) => state.side.appear);

  return (
    <Editor
      sideAppear={sideAppear}
      firstList={firstList}
      userName={user.userName}
      recentPagesId={user.recentPagesId}
      page={page}
      pages={pages}
      pagesId={pagesId}
      isInTrash={isInTrash}
      showAllComments={showAllComments}
      setShowAllComments={setShowAllComments}
      discardEdit={discardEdit}
      setDiscardEdit={setDiscardEdit}
      setOpenExport={setOpenExport}
      modal={modal}
      setModal={setModal}
      openComment={openComment}
      setOpenComment={setOpenComment}
      commentBlock={commentBlock}
      setCommentBlock={setCommentBlock}
      smallText={smallText}
      setSmallText={setSmallText}
      fullWidth={fullWidth}
      setFullWidth={setFullWidth}
      openTemplates={openTemplates}
      setOpenTemplates={setOpenTemplates}
      fontStyle={fontStyle}
      setFontStyle={setFontStyle}
      mobileSideMenu={mobileSideMenu}
      setMobileSideMenu={setMobileSideMenu}
      openExport={openExport}
    />
  );
};

export default React.memo(EditorContainer);
