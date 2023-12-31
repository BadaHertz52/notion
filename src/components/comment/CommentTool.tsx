import React, { Dispatch, SetStateAction, useRef, CSSProperties } from "react";

import { BsThreeDots } from "react-icons/bs";

import { ScreenOnly, ResolveBtn } from "../index";

import { SESSION_KEY } from "../../constants";
import { Block, MainCommentType, Page, SubCommentType } from "../../types";

export type CommentToolProps = {
  isMainComment: boolean;
  comment: SubCommentType | MainCommentType;
  block?: Block;
  page: Page;
  pageId: string;
  editBlock: (pageId: string, block: Block) => void;
  editPage?: (pageId: string, newPage: Page) => void;
  frameHtml: HTMLElement | null;
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>>;
  moreOpen: boolean;
  setMoreOpen: Dispatch<SetStateAction<boolean>>;
  setToolMoreStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  templateHtml: HTMLElement | null;
};

const CommentTool = ({
  isMainComment,
  comment,
  block,
  page,
  pageId,
  editBlock,
  editPage,
  frameHtml,
  setAllComments,
  moreOpen,
  setMoreOpen,
  setToolMoreStyle,
  templateHtml,
}: CommentToolProps) => {
  const commentToolRef = useRef<HTMLDivElement>(null);

  const openToolMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMoreOpen(true);

    const target = event.currentTarget;
    const commentToolDomRect = commentToolRef.current?.getClientRects()[0];
    const commentEl = target.closest(".comment");
    const commentsEl = target.closest(".comments");
    const commentDomRect = commentEl?.getClientRects()[0];
    if (commentToolDomRect && commentDomRect && commentsEl) {
      const commentsStyle = window.getComputedStyle(commentsEl);
      const marginTop = Number(
        commentsStyle.getPropertyValue("margin-top").replace("px", "")
      );
      const paddingRight = Number(
        commentsStyle.getPropertyValue("padding-right").replace("px", "")
      );
      const EXTRA_SPACE = 5;

      setToolMoreStyle({
        position: "absolute",
        top:
          commentToolDomRect.bottom -
          commentDomRect.top +
          marginTop +
          EXTRA_SPACE,
        right: commentDomRect.right - commentToolDomRect.right + paddingRight,
      });
    }

    sessionStorage.setItem(SESSION_KEY.toolMoreItem, JSON.stringify(comment));
  };

  return (
    <div className="comment__tool" ref={commentToolRef}>
      {isMainComment && (
        <ResolveBtn
          page={page}
          pageId={pageId}
          block={block}
          editBlock={editBlock}
          editPage={editPage}
          setAllComments={setAllComments}
          comment={comment as MainCommentType}
        />
      )}
      <button
        className="btn-comment__tool-more"
        onClick={
          !moreOpen ? (event) => openToolMore(event) : () => setMoreOpen(false)
        }
      >
        <ScreenOnly text="more comment tool" />
        <span>
          <BsThreeDots />
        </span>
      </button>
    </div>
  );
};

export default React.memo(CommentTool);
