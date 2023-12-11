import React, { Dispatch, SetStateAction } from "react";

import { CSSProperties } from "styled-components";

import { Block, MainCommentType, Page, SubCommentType } from "../../types";
import { CommentBlock, CommentInput } from "../index";

type CommentProps = {
  userName: string;
  comment: MainCommentType;
  pageId: string;
  page: Page;
  /**
   *block=== undefined 이면 page에 대한 comments, block !== undefined 이면 block에 대한 comments
   */
  block?: Block;
  editBlock: (pageId: string, block: Block) => void;
  editPage?: (pageId: string, newPage: Page) => void;
  frameHtml: HTMLElement | null;
  allComments: MainCommentType[] | null;
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>>;
  /**
   * ToolMore를 열것인지 에 대한 값
   */
  moreOpen: boolean;
  setMoreOpen: Dispatch<SetStateAction<boolean>>;
  /**
   * ToolMore의 위치를 지정함
   */
  setToolMoreStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  discardEdit?: boolean;
  setDiscardEdit?: Dispatch<SetStateAction<boolean>>;
  templateHtml: HTMLElement | null;
  showAllComments: boolean;
};

const Comment = ({ ...props }: CommentProps) => {
  const { comment } = props;
  return (
    <div className="comment">
      <div className="comment__mainComment">
        <CommentBlock {...props} isMainComment={true} />
      </div>
      {comment.subComments && (
        <div className="comment__subComments">
          {comment.subComments.map((comment: SubCommentType) => (
            <CommentBlock
              {...props}
              key={`commentBlock_${comment.id}`}
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
