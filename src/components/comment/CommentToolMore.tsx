import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { CSSProperties } from "styled-components";

import { HiOutlinePencil } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";

import { Block, MainCommentType, Page, SubCommentType } from "../../types";
import { setTemplateItem, findBlock } from "../../utils";
import { SESSION_KEY } from "../../constants";

type CommentToolMoreProps = {
  pageId: string;
  page: Page;
  blockId: string | null;
  editBlock: (pageId: string, block: Block) => void;
  editPage: ((pageId: string, newPage: Page) => void) | null;
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>>;
  setMoreOpen: Dispatch<SetStateAction<boolean>>;
  toolMoreStyle: CSSProperties | undefined;
  templateHtml: HTMLElement | null;
};

const CommentToolMore = ({
  pageId,
  blockId,
  page,
  editBlock,
  editPage,
  setAllComments,
  setMoreOpen,
  toolMoreStyle,
  templateHtml,
}: CommentToolMoreProps) => {
  const toolMoreItem = sessionStorage.getItem(SESSION_KEY.toolMoreItem);
  const [comment, setComment] = useState<
    MainCommentType | SubCommentType | null
  >(null);
  const editTime = JSON.stringify(Date.now());

  const onClickDeleteComment = useCallback(() => {
    setTemplateItem(templateHtml, page);
    setMoreOpen(false);
    //page.header.comments 가 아닐 경우
    if (blockId) {
      //delete blockComment
      const block = findBlock(page, blockId).BLOCK;
      if (comment && block && block.comments) {
        const blockComments: MainCommentType[] = [...block.comments];
        const mainCommentIds = blockComments.map((m: MainCommentType) => m.id);

        const updateBlock = (changeContent: boolean) => {
          const templateHtml = document.getElementById("template");
          setTemplateItem(templateHtml, page);
          let blockContents = block.contents;
          if (changeContent) {
            blockContents = document.getElementById(`${block.id}__contents`)
              ?.firstElementChild?.innerHTML as string;
          }
          const editedBlock: Block = {
            ...block,
            contents: blockContents,
            editTime: editTime,
            comments: !blockComments[0] ? null : blockComments,
          };
          editBlock(page.id, editedBlock);
          setAllComments && setAllComments(editedBlock.comments);
        };

        if (mainCommentIds?.includes(comment.id)) {
          //MainCommentType
          const index = mainCommentIds.indexOf(comment.id);
          const targetMainComment = blockComments[index];
          if (targetMainComment.selectedText) {
            const textCommentBtnElement = document
              .getElementById(`${block.id}__contents`)
              ?.getElementsByClassName(`mainId_${targetMainComment.id}`)[0];
            if (textCommentBtnElement) {
              textCommentBtnElement.outerHTML = textCommentBtnElement.innerHTML;
            }
          }
          blockComments.splice(index, 1);
          updateBlock(targetMainComment.selectedText !== null);
        } else {
          //SubCommentType
          const mainComment: MainCommentType = blockComments.filter(
            (b: MainCommentType) => b.subCommentsId?.includes(comment.id)
          )[0];
          const mainCommentIndex = mainCommentIds.indexOf(mainComment.id);
          const commentIndex = mainCommentIds.indexOf(comment.id);
          mainComment.subComments?.splice(commentIndex, 1);
          mainComment.subCommentsId?.splice(commentIndex, 1);
          const newMainComment: MainCommentType = {
            ...mainComment,
          };
          blockComments.splice(mainCommentIndex, 1, newMainComment);
          updateBlock(false);
        }
      }
    } else {
      //page.header.comments 인 경우
      if (comment && page.header.comments) {
        const pageComments = [...page.header.comments];
        const pageCommentsId = pageComments.map((c: MainCommentType) => c.id);
        const isBlockComment = pageCommentsId.includes(comment.id);
        if (isBlockComment) {
          const index = pageCommentsId.indexOf(comment.id);
          pageComments.splice(index, 1);
          const editedPage: Page = {
            ...page,
            header: {
              ...page.header,
              comments: pageComments[0] === undefined ? null : pageComments,
            },
            editTime: editTime,
          };
          editPage && editPage(pageId, editedPage);
          setAllComments && setAllComments(editedPage.header.comments);
        } else {
          const pageComment = pageComments.filter((pc: MainCommentType) =>
            pc.subCommentsId?.includes(comment.id)
          )[0];
          const pageCommentIndex = pageCommentsId.indexOf(pageComment.id);
          const subComments = [
            ...(pageComment.subComments as SubCommentType[]),
          ];
          const subCommentsId = [...(pageComment.subCommentsId as string[])];
          const subCommentIndex = subCommentsId.indexOf(comment.id);
          subCommentsId.splice(subCommentIndex, 1);
          subComments.splice(subCommentIndex, 1);
          const editedPageComment: MainCommentType = {
            ...pageComment,
            subComments: subComments[0] === undefined ? null : subComments,
            subCommentsId:
              subCommentsId[0] === undefined ? null : subCommentsId,
          };
          pageComments.splice(pageCommentIndex, 1, editedPageComment);

          const editedPage: Page = {
            ...page,
            header: {
              ...page.header,
              comments: pageComments,
            },
          };
          setAllComments && setAllComments(pageComments);
          editPage && editPage(pageId, editedPage);
        }
      }
    }
    sessionStorage.removeItem(SESSION_KEY.toolMoreItem);
  }, [
    blockId,
    comment,
    editBlock,
    editPage,
    editTime,
    page,
    pageId,
    setAllComments,
    setMoreOpen,
    templateHtml,
  ]);

  const onClickEditComment = useCallback(() => {
    setMoreOpen(false);
    comment && sessionStorage.setItem(SESSION_KEY.editComment, comment.id);
    sessionStorage.removeItem(SESSION_KEY.toolMoreItem);
  }, [comment, setMoreOpen]);

  useEffect(() => {
    if (toolMoreItem) {
      const item = JSON.parse(toolMoreItem);
      setComment(item);
    }
  }, [toolMoreItem]);

  return (
    <div className="comment__tool-more" style={toolMoreStyle}>
      <button onClick={onClickEditComment}>
        <HiOutlinePencil />
        <span>Edit comment</span>
      </button>
      <button onClick={onClickDeleteComment}>
        <IoTrashOutline />
        <span>Delete comment</span>
      </button>
    </div>
  );
};

export default React.memo(CommentToolMore);
