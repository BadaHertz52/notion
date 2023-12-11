import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CSSProperties } from "styled-components";

import { Block, MainCommentType, Page, SubCommentType } from "../../types";

import { CommentTool, CommentInput, Time } from "../index";
import { SESSION_KEY } from "../../constants";
import { CommentInputProps } from "./CommentInput";
import { CommentToolProps } from "./CommentTool";

export type CommentBlockProps = Omit<
  CommentInputProps,
  "mainComment" | "setEdit" | "addOrEdit" | "subComment" | "mainComment"
> &
  CommentToolProps & {
    comment: SubCommentType | MainCommentType;
    isMainComment: boolean;
    block?: Block;
    page: Page;
    moreOpen: boolean;
    setMoreOpen: Dispatch<SetStateAction<boolean>>;
    setToolMoreStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
    discardEdit?: boolean;
    setDiscardEdit?: Dispatch<SetStateAction<boolean>>;
    showAllComments: boolean;
  };

const CommentBlock = ({ ...props }: CommentBlockProps) => {
  const { comment, isMainComment, block, discardEdit, setDiscardEdit } = props;
  const firstLetter = comment.userName.substring(0, 1).toUpperCase();
  const [edit, setEdit] = useState<boolean>(false);
  const editCommentItem = sessionStorage.getItem(SESSION_KEY.editComment);
  const targetMainComment = isMainComment ? (comment as MainCommentType) : null;
  const blockContentEl = document.getElementById(
    `${block?.id}__contents`
  )?.textContent;
  useEffect(() => {
    // discard edit
    if (editCommentItem) {
      if (discardEdit) {
        setEdit(false);
        sessionStorage.removeItem(SESSION_KEY.editComment);
        setDiscardEdit && setDiscardEdit(false);
      } else {
        comment.id === editCommentItem && setEdit(true);
      }
    }
  }, [editCommentItem, comment.id, discardEdit, setDiscardEdit]);
  return (
    <div className="commentBlock">
      <section className="commentBlock__header">
        <div className="information">
          <div className="firstLetter">
            <div>{firstLetter}</div>
          </div>
          <div className="userName">{comment.userName}</div>
          <Time editTime={comment.editTime} />
        </div>
        <CommentTool {...props} />
      </section>
      {isMainComment && (
        <section className="commentBlock__mainComment">
          <div className="commentBlock__mainComment_line"></div>
          {block && (
            <div className="commentBlock__mainComment_content">
              {targetMainComment?.selectedText
                ? targetMainComment?.selectedText
                : blockContentEl}
            </div>
          )}
        </section>
      )}
      <section className="comment__contents">
        {edit ? (
          <CommentInput
            {...props}
            mainComment={!isMainComment ? null : (comment as MainCommentType)}
            subComment={!isMainComment ? (comment as SubCommentType) : null}
            addOrEdit="edit"
            setEdit={setEdit}
          />
        ) : (
          comment.content
        )}
      </section>
    </div>
  );
};

export default React.memo(CommentBlock);
