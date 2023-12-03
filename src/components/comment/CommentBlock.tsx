import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CSSProperties } from "styled-components";

import {
  Block,
  MainCommentType,
  Page,
  SubCommentType,
  ModalType,
} from "../../types";

import { CommentTool, CommentInput, Time } from "../index";
import { SESSION_KEY } from "../../constants";

type CommentBlockProps = {
  comment: SubCommentType | MainCommentType;
  mainComment: boolean;
  block: Block | null;
  page: Page;
  pageId: string;
  userName: string;
  editBlock: (pageId: string, block: Block) => void;
  editPage: ((pageId: string, newPage: Page) => void) | null;
  frameHtml: HTMLElement | null;
  allComments: MainCommentType[] | null;
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>> | null;
  moreOpen: boolean;
  setMoreOpen: Dispatch<SetStateAction<boolean>>;
  setToolMoreStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  setModal: Dispatch<SetStateAction<ModalType>> | null;
  discardEdit: boolean;
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
  templateHtml: HTMLElement | null;
  showAllComments: boolean;
};

const CommentBlock = ({
  comment,
  mainComment,
  block,
  page,
  pageId,
  userName,
  editBlock,
  editPage,
  setModal,
  frameHtml,
  allComments,
  setAllComments,
  moreOpen,
  setMoreOpen,
  setToolMoreStyle,
  discardEdit,
  setDiscardEdit,
  templateHtml,
  showAllComments,
}: CommentBlockProps) => {
  const firstLetter = comment.userName.substring(0, 1).toUpperCase();
  const [edit, setEdit] = useState<boolean>(false);
  const editCommentItem = sessionStorage.getItem(SESSION_KEY.editComment);
  const targetMainComment = mainComment ? (comment as MainCommentType) : null;
  const blockContentEl = document.getElementById(
    `${block?.id}__contents`
  )?.textContent;
  useEffect(() => {
    // discard edit
    if (editCommentItem) {
      if (discardEdit) {
        setEdit(false);
        sessionStorage.removeItem(SESSION_KEY.editComment);
        setDiscardEdit(false);
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
        <CommentTool
          mainComment={mainComment}
          comment={comment}
          block={block}
          page={page}
          pageId={pageId}
          editBlock={editBlock}
          editPage={editPage}
          frameHtml={frameHtml}
          setAllComments={setAllComments}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
          templateHtml={templateHtml}
          showAllComments={showAllComments}
        />
      </section>
      {mainComment && (
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
            userName={userName}
            pageId={pageId}
            page={page}
            mainComment={!mainComment ? null : (comment as MainCommentType)}
            subComment={!mainComment ? (comment as SubCommentType) : null}
            editBlock={editBlock}
            editPage={editPage}
            commentBlock={block}
            allComments={allComments}
            setAllComments={setAllComments}
            setModal={setModal}
            addOrEdit="edit"
            setEdit={setEdit}
            templateHtml={templateHtml}
            frameHtml={frameHtml}
          />
        ) : (
          comment.content
        )}
      </section>
    </div>
  );
};

export default React.memo(CommentBlock);
