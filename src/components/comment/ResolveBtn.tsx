import React, { Dispatch, SetStateAction, useCallback } from "react";

import { Block, CommentType, MainCommentType, Page } from "../../types";
import { isTemplates, setOriginTemplateItem } from "../../utils";

type ResolveBtnProps = {
  page: Page;
  pageId: string;
  block?: Block;
  comment: MainCommentType;
  editPage?: (pageId: string, newPage: Page) => void;
  editBlock: (pageId: string, block: Block) => void;
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>>;
};

const ResolveBtn = ({
  page,
  pageId,
  comment,
  block,
  editBlock,
  editPage,
  setAllComments,
}: ResolveBtnProps) => {
  const changeCommentType = useCallback(() => {
    const newType: CommentType = comment.type === "open" ? "resolve" : "open";
    const editTime = JSON.stringify(Date.now());
    const newComment: MainCommentType = {
      ...comment,
      type: newType,
      editTime: editTime,
    };
    if (isTemplates()) {
      setOriginTemplateItem(page);
    }
    if (block) {
      const comments = block.comments ? [...block.comments] : [];
      const commentIdes: string[] = comments?.map(
        (comment: MainCommentType) => comment.id
      ) as string[];
      const index = commentIdes.indexOf(comment.id);
      comments.splice(index, 1, newComment);
      const openComments = comments.filter((c) => c.type === "open");
      const editedBlock: Block = {
        ...block,
        comments: comments,
        editTime: editTime,
      };
      editBlock(pageId, editedBlock);
      setAllComments(openComments[0] ? openComments : null);
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
        editPage && editPage(pageId, editedPage);
      }
    }
  }, [block, comment, editBlock, editPage, page, pageId, setAllComments]);

  return (
    <button className="comment__tool-resolve" onClick={changeCommentType}>
      <span> {comment.type === "open" ? "Resolve" : "open"}</span>
    </button>
  );
};

export default React.memo(ResolveBtn);
