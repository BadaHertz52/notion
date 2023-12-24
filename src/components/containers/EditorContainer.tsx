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
      {...props}
      sideAppear={side.appear}
      userName={user.userName}
      recentPagesId={user.recentPagesId}
      pages={notion.pages as Page[]}
      pagesId={notion.pagesId as string[]}
    />
  );
};

export default React.memo(EditorContainer);
