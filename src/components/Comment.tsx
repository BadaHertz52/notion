import React, { Dispatch, SetStateAction } from "react";
import {
  Block,
  MainCommentType,
  Page,
  SubCommentType,
} from "../modules/notion/type";
import { CSSProperties } from "styled-components";
import CommentBlock from "./CommentBlock";
import CommentInput from "./CommentInput";
type CommentProps = {
  userName: string;
  comment: MainCommentType;
  pageId: string;
  page: Page;
  /**
   *block===null 이면 page에 대한 comments, block !==null 이면 block에 대한 comments
   */
  block: Block | null;
  editBlock: (pageId: string, block: Block) => void;
  editPage: ((pageId: string, newPage: Page) => void) | null;
  frameHtml: HTMLElement | null;
  allComments: MainCommentType[] | null;
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>> | null;
  /**
   * ToolMore를 열것인지 에 대한 값
   */
  moreOpen: boolean;
  setMoreOpen: Dispatch<SetStateAction<boolean>>;
  /**
   * ToolMore의 위치를 지정함
   */
  setToolMoreStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  discardEdit: boolean;
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
  templateHtml: HTMLElement | null;
  showAllComments: boolean;
};

const Comment = ({
  userName,
  comment,
  block,
  page,
  pageId,
  editBlock,
  editPage,
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
}: CommentProps) => {
  return (
    <div className="comment">
      <div className="comment__mainComment">
        <CommentBlock
          userName={userName}
          comment={comment}
          mainComment={true}
          block={block}
          page={page}
          pageId={pageId}
          editBlock={editBlock}
          editPage={editPage}
          frameHtml={frameHtml}
          allComments={allComments}
          setAllComments={setAllComments}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
          setModal={null}
          discardEdit={discardEdit}
          setDiscardEdit={setDiscardEdit}
          templateHtml={templateHtml}
          showAllComments={showAllComments}
        />
      </div>
      {comment.subComments && (
        <div className="comment__subComments">
          {comment.subComments.map((comment: SubCommentType) => (
            <CommentBlock
              key={`commentBlock_${comment.id}`}
              userName={userName}
              comment={comment}
              mainComment={false}
              page={page}
              pageId={pageId}
              block={block}
              editBlock={editBlock}
              editPage={editPage}
              frameHtml={frameHtml}
              allComments={allComments}
              setAllComments={setAllComments}
              moreOpen={moreOpen}
              setMoreOpen={setMoreOpen}
              setToolMoreStyle={setToolMoreStyle}
              setModal={null}
              discardEdit={discardEdit}
              setDiscardEdit={setDiscardEdit}
              templateHtml={templateHtml}
              showAllComments={showAllComments}
            />
          ))}
        </div>
      )}
      <CommentInput
        userName={userName}
        page={page}
        pageId={pageId}
        editBlock={editBlock}
        editPage={editPage}
        mainComment={comment}
        subComment={null}
        commentBlock={block}
        allComments={allComments}
        setAllComments={setAllComments}
        setModal={null}
        addOrEdit="add"
        setEdit={null}
        templateHtml={templateHtml}
        frameHtml={frameHtml}
      />
    </div>
  );
};

export default React.memo(Comment);
