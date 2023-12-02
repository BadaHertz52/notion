import React, { Dispatch, SetStateAction, useCallback } from "react";

import { Block, CommentType, MainCommentType, Page } from "../../types";
import { setTemplateItem } from "../../utils";

type ResolveBtnProps = {
  page: Page;
  pageId: string;
  block: Block | null;
  comment: MainCommentType;
  templateHtml: HTMLElement | null;
  editPage: ((pageId: string, newPage: Page) => void) | null;
  editBlock: (pageId: string, block: Block) => void;
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>> | null;
};

const ResolveBtn = ({
  page,
  pageId,
  comment,
  templateHtml,
  block,
  editBlock,
  editPage,
  setAllComments,
}: ResolveBtnProps) => {
  const changeCommentType = useCallback(() => {
    const newType: CommentType = comment.type === "open" ? "resolve" : "open";
    if (page) {
      setTemplateItem(templateHtml, page);
    }
    const editTime = JSON.stringify(Date.now());
    const newComment: MainCommentType = {
      ...comment,
      type: newType,
      editTime: editTime,
    };
    if (block) {
      const comments = block.comments ? [...block.comments] : [];
      const commentIdes: string[] = comments?.map(
        (comment: MainCommentType) => comment.id
      ) as string[];
      const index = commentIdes.indexOf(comment.id);
      comments.splice(index, 1, newComment);
      const editedBlock: Block = {
        ...block,
        comments: comments,
        editTime: editTime,
      };
      editBlock(pageId, editedBlock);
      setAllComments && setAllComments(editedBlock.comments);
    } else {
      const pageComment = page.header.comments?.[0];
      if (pageComment) {
        const editedPageComment: MainCommentType = {
          ...pageComment,
          type: newType,
          editTime: editTime,
        };
        const editedPage: Page = {
          ...page,
          header: {
            ...page.header,
            comments: [editedPageComment],
          },
          editTime: editTime,
        };
        setAllComments && setAllComments(editedPage.header.comments);
        editPage && editPage(pageId, editedPage);
      }
    }
  }, [
    block,
    comment,
    editBlock,
    editPage,
    page,
    pageId,
    setAllComments,
    templateHtml,
  ]);

  return (
    <button className="comment__tool-resolve" onClick={changeCommentType}>
      <span> {comment.type === "open" ? "Resolve" : "open"}</span>
    </button>
  );
};

export default React.memo(ResolveBtn);
