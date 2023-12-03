import React, { Dispatch, SetStateAction, useRef } from "react";

import { CSSProperties } from "styled-components";

import { BsThreeDots } from "react-icons/bs";

import { ScreenOnly, ResolveBtn } from "../index";

import { Block, MainCommentType, Page, SubCommentType } from "../../types";
import { SESSION_KEY } from "../../constants";

type CommentToolProps = {
  mainComment: boolean;
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
  const EXTRA_SPACE: number = 5;

  const setToolMoreStyleInPageComments = (commentToolDomRect: DOMRect) => {
    const templateHtml = document.getElementById("template");
    const pageComment = !templateHtml
      ? (document.querySelector(".page__comments") as HTMLElement | null)
      : (templateHtml.querySelector(".page__comments") as HTMLElement | null);
    if (pageComment) {
      const pageCommentsDomRect = pageComment?.getClientRects()[0];
      const style: CSSProperties = {
        position: "absolute",
        top: commentToolDomRect.bottom - pageCommentsDomRect.top + EXTRA_SPACE,
        right: pageCommentsDomRect.right - commentToolDomRect.right,
      };
      setToolMoreStyle(style);
    } else {
      console.error("Error:Can't find pageComment element");
    }
  };
  const setToolMoreStyleInBlockComment = (commentToolDomRect: DOMRect) => {
    const heightOfTopBar =
      document.getElementsByClassName("topBar")[0]?.clientHeight;
    const style: CSSProperties = {
      position: "absolute",
      top: commentToolDomRect.bottom - heightOfTopBar + EXTRA_SPACE,
      right: window.innerWidth - commentToolDomRect.right,
    };
    setToolMoreStyle(style);
  };
  const setToolMoreStyleInAllComments = (
    target: EventTarget & HTMLButtonElement,
    commentToolDomRect: DOMRect
  ) => {
    const targetDomRect = target.getClientRects()[0] as DOMRect;
    const top = targetDomRect.bottom + EXTRA_SPACE;
    const right = window.innerWidth - commentToolDomRect.right;
    const style: CSSProperties = {
      position: "absolute",
      top: top,
      right: right,
    };
    setToolMoreStyle(style);
  };
  const openToolMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMoreOpen(true);

    const target = event.currentTarget;
    const commentToolDomRect = commentToolRef.current?.getClientRects()[0];
    const blockCommentsHtml = document.getElementById("block-comments");

    if (commentToolDomRect) {
      if (showAllComments) {
        setToolMoreStyleInAllComments(target, commentToolDomRect);
      } else {
        !blockCommentsHtml
          ? setToolMoreStyleInPageComments(commentToolDomRect)
          : setToolMoreStyleInBlockComment(commentToolDomRect);
      }
    }
    sessionStorage.setItem(SESSION_KEY.toolMoreItem, JSON.stringify(comment));
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
