import React from "react";

import { MainCommentType, SubCommentType } from "../../types";
import { CommentBlock, CommentInput } from "../index";
import { CommentBlockProps } from "./CommentBlock";
import { CommentInputProps } from "./CommentInput";

type CommentProps = Omit<CommentBlockProps, "isMainComment" | "comment"> &
  Omit<
    CommentInputProps,
    "        commentBlock" | "mainComment" | "subComment" | "addOrEdit"
  > & {
    comment: MainCommentType;
  };

const Comment = ({ ...props }: CommentProps) => {
  const { comment } = props;
  return (
    <div className="comment">
      <div className="comment__mainComment">
        <CommentBlock {...props} comment={comment} isMainComment={true} />
      </div>
      {comment.subComments && (
        <div className="comment__subComments">
          {comment.subComments.map((subComment: SubCommentType) => (
            <CommentBlock
              {...props}
              key={`commentBlock_${subComment.id}`}
              comment={subComment}
              isMainComment={true}
            />
          ))}
        </div>
      )}
      <CommentInput
        {...props}
        commentBlock={props.block}
        mainComment={comment}
        subComment={null}
        addOrEdit="add"
      />
    </div>
  );
};

export default React.memo(Comment);
