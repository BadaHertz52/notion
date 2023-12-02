import React, { Dispatch, SetStateAction, useRef } from "react";

import { CSSProperties } from "styled-components";

import { BsThreeDots } from "react-icons/bs";

import { ScreenOnly, ResolveBtn } from "../index";

import { Block, MainCommentType, Page, SubCommentType } from "../../types";

type CommentToolProps = {
  mainComment: boolean;
  comment: SubCommentType | MainCommentType;
  block: Block | null;
  page: Page;
  pageId: string;
  editBlock: (pageId: string, block: Block) => void;
  editPage: ((pageId: string, newPage: Page) => void) | null;
  frameHtml: HTMLElement | null;
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>> | null;
  moreOpen: boolean;
  setMoreOpen: Dispatch<SetStateAction<boolean>>;
  setToolMoreStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  templateHtml: HTMLElement | null;
  showAllComments: boolean;
};

const CommentTool = ({
  mainComment,
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
  showAllComments,
}: CommentToolProps) => {
  const commentToolRef = useRef<HTMLDivElement>(null);

  const openToolMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMoreOpen(true);
    const target = event.currentTarget;
    const targetDomRect = target.getClientRects()[0] as DOMRect;
    const commentToolDomRect = commentToolRef.current?.getClientRects()[0];
    const blockCommentsHtml = document.getElementById("block-comments");
    //frame 에서의 comments
    if (!showAllComments && commentToolDomRect && frameHtml) {
      if (blockCommentsHtml === null) {
        //pageComment
        const templateHtml = document.getElementById("template");
        const pageComment =
          templateHtml === null
            ? (document.querySelector(".page__comments") as HTMLElement | null)
            : (templateHtml.querySelector(
                ".page__comments"
              ) as HTMLElement | null);
        if (pageComment) {
          const pageCommentsDomRect = pageComment?.getClientRects()[0];
          const style: CSSProperties = {
            position: "absolute",
            top:
              commentToolDomRect.top -
              pageCommentsDomRect.top +
              commentToolDomRect.height +
              5,
            right: pageCommentsDomRect.right - commentToolDomRect.right,
          };
          setToolMoreStyle(style);
        } else {
          console.error("Error:Can't find pageComment element");
        }
      } else {
        //blockComment
        const style: CSSProperties = {
          position: "absolute",
          top: commentToolDomRect.top + commentToolDomRect.height + 5,
          right: window.innerWidth - commentToolDomRect.right,
        };
        setToolMoreStyle(style);
      }
    }
    //AllComments에서의 comments
    if (showAllComments && commentToolDomRect) {
      const top = targetDomRect.bottom + 5;
      const right = window.innerWidth - commentToolDomRect.right;
      const style: CSSProperties = {
        position: "absolute",
        top: top,
        right: right,
      };
      setToolMoreStyle(style);
    }
    sessionStorage.setItem("toolMoreItem", JSON.stringify(comment));
  };

  return (
    <div className="comment__tool" ref={commentToolRef}>
      {mainComment && (
        <ResolveBtn
          page={page}
          pageId={pageId}
          block={block}
          templateHtml={templateHtml}
          editBlock={editBlock}
          editPage={editPage}
          setAllComments={setAllComments}
          comment={comment as MainCommentType}
        />
      )}
      <button
        className="comment__tool-more"
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
