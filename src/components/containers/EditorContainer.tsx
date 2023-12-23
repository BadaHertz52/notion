import React from "react";
import { useSelector } from "react-redux";

import { Editor } from "../index";
import { EditorProps } from "../editor/Editor";

import { RootState } from "../../modules";
import { Page } from "../../types";

export type EditorContainerProps = Omit<
  EditorProps,
  "sideAppear" | "userName" | "recentPagesId" | "user" | "pagesId" | "pages"
>;

const EditorContainer = ({ ...props }: EditorContainerProps) => {
  const rootState = useSelector((state: RootState) => state);
  const { user, side, notion } = rootState;

  return (
    <Editor
      sideAppear={side.appear}
      firstList={props.firstList}
      userName={user.userName}
      recentPagesId={user.recentPagesId}
      page={props.page}
      pages={notion.pages as Page[]}
      pagesId={notion.pagesId as string[]}
      isInTrash={props.isInTrash}
      showAllComments={props.showAllComments}
      setShowAllComments={props.setShowAllComments}
      discardEdit={props.discardEdit}
      setDiscardEdit={props.setDiscardEdit}
      setOpenExport={props.setOpenExport}
      openComment={props.openComment}
      setOpenComment={props.setOpenComment}
      commentBlock={props.commentBlock}
      setCommentBlock={props.setCommentBlock}
      smallText={props.smallText}
      setSmallText={props.setSmallText}
      fullWidth={props.fullWidth}
      setFullWidth={props.setFullWidth}
      openTemplates={props.openTemplates}
      setOpenTemplates={props.setOpenTemplates}
      fontStyle={props.fontStyle}
      setFontStyle={props.setFontStyle}
      openExport={props.openExport}
    />
  );
};

export default React.memo(EditorContainer);
