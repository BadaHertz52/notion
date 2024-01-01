import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  CSSProperties,
} from "react";

import { CommentTool, CommentInput, Time } from "../index";
import { CommentInputProps } from "./CommentInput";
import { CommentToolProps } from "./CommentTool";

import { SESSION_KEY } from "../../constants";
import { Block, MainCommentType, Page, SubCommentType } from "../../types";

export type CommentBlockProps = Omit<
  CommentInputProps,
  "mainComment" | "setEdit" | "addOrEdit" | "subComment" | "mainComment"
> &
  CommentToolProps & {
    comment: SubCommentType | MainCommentType;
    block?: Block;
    page: Page;
    moreOpen: boolean;
    setMoreOpen: Dispatch<SetStateAction<boolean>>;
    setToolMoreStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
    setDiscardEdit?: Dispatch<SetStateAction<boolean>>;
    openDiscardEdit: boolean;
    setOpenDiscardEdit: Dispatch<SetStateAction<boolean>>;
  };

const CommentBlock = ({ ...props }: CommentBlockProps) => {
  const {
    comment,
    isMainComment,
    block,
    setDiscardEdit,
    openDiscardEdit,
    moreOpen,
  } = props;
  const firstLetter = comment.userName.substring(0, 1).toUpperCase();
  const [edit, setEdit] = useState<boolean>(false);

  const targetMainComment = isMainComment ? (comment as MainCommentType) : null;
  const blockContentEl = document.getElementById(
    `${block?.id}__contents`
  )?.textContent;

  useEffect(() => {
    const editCommentItem = sessionStorage.getItem(SESSION_KEY.editComment);
    setEdit(editCommentItem === comment.id);
  }, [moreOpen, comment]);

  useEffect(() => {
    // discard edit
    if (!openDiscardEdit) {
      const editCommentItem = sessionStorage.getItem(SESSION_KEY.editComment);
      setEdit(comment.id === editCommentItem);
    }
  }, [openDiscardEdit, comment.id, setDiscardEdit]);

  return (
    <div className="commentBlock">
      <section className="commentBlock__header">
        <div className="information">
          <div className="first-letter">
            <div>{firstLetter}</div>
          </div>
          <div className="userName">
            <div>{comment.userName}</div>
          </div>
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
            commentBlock={props.block}
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
