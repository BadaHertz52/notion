import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
  MouseEvent,
  useEffect,
  useCallback,
  useRef,
  CSSProperties,
} from "react";

import { IoMdCloseCircle } from "react-icons/io";
import { IoArrowUpCircleSharp, IoCheckmarkCircle } from "react-icons/io5";

import { ScreenOnly } from "../index";

import { SESSION_KEY } from "../../constants";
import {
  Block,
  MainCommentType,
  Page,
  SubCommentType,
  ModalType,
} from "../../types";
import { getEditTime, setOriginTemplateItem } from "../../utils";

export type CommentInputProps = {
  userName: string;
  pageId: string;
  page: Page;
  /**
   * addOrEdit === add : 새로운 mainComment를 만들거나 mainComment에 새로운 subComment를 추가
   * addOrEdit === edit : mainComment 나 subComment 내용 수정
   */
  addOrEdit: "add" | "edit";
  /**
   * <CASE1. addOrEdit === "add"> 
   * (이때 subComment==null)
   * 
    1.mainComment===null && subComment==null 
    =>새로운 mainComment를 만들어야 하는 상황

    2.mainComment!==null && subComment==null
    => mainComment에 새로운 subComment를 만들어야하는 상황

   * <CASE2. addOrEdit === "edit" 일때>
    
    (이때 mainComment , subComment 둘 중 하나만 null, 수정되는 comment만 값을 가짐) 

    1. mainComment !==null => mainComment를 수정해야하는 상황

    2. subComment !==null => subComment를 수정해야하는 상황 
   */
  mainComment: MainCommentType | null;
  subComment: SubCommentType | null;
  editBlock?: (pageId: string, block: Block) => void;
  editPage?: (pageId: string, newPage: Page) => void;
  commentBlock?: Block;
  /**
   * block의 comments 이거나 page.header.comments
   */
  allComments: MainCommentType[] | null;
  setAllComments?: Dispatch<SetStateAction<MainCommentType[] | null>>;
  setModal?: Dispatch<SetStateAction<ModalType>>;
  setOpenDiscardEdit?: Dispatch<SetStateAction<boolean>>;
  setEdit?: Dispatch<SetStateAction<boolean>>;
  frameHtml: HTMLElement | null;
};

const CommentInput = ({
  userName,
  pageId,
  page,
  mainComment,
  subComment,
  editBlock,
  editPage,
  commentBlock,
  allComments,
  setAllComments,
  setModal,
  addOrEdit,
  setOpenDiscardEdit,
  setEdit,
  frameHtml,
}: CommentInputProps) => {
  const userNameFirstLetter = userName.substring(0, 1).toUpperCase();

  const [editTargetComment, setEditTargetComment] = useState<
    MainCommentType | SubCommentType | null
  >(null);
  const REPLY = "Reply...";
  const changing = editTargetComment?.content;
  const MAKING_MAIN = "Add a comment";
  type situationType = typeof REPLY | typeof changing | typeof MAKING_MAIN;
  const [placeHolder, setPlaceHolder] = useState<situationType>(MAKING_MAIN);
  const [submitStyle, setSubmitStyle] = useState<CSSProperties>({
    fill: "#a3a3a2",
    border: "none",
  });
  const [text, setText] = useState<string>("");
  const commentInputRef = useRef<HTMLDivElement>(null);

  const selectedHtml = document.querySelector(".selected");
  const selectedHtmlText = selectedHtml?.innerHTML;

  const updateBlock = useCallback(
    (blockComments: MainCommentType[]) => {
      if (commentBlock && editBlock) {
        let editedBlock: Block = {
          ...commentBlock,
          comments: blockComments,
        };
        if (selectedHtml) {
          const blockContentHtml = document.getElementById(
            `${commentBlock.id}__contents`
          )?.firstElementChild;
          const blockContents = blockContentHtml?.innerHTML;
          if (blockContents) {
            editedBlock = {
              ...editedBlock,
              contents: blockContents,
            };
          }
        }
        console.log("blockcomments", blockComments, "edited", editedBlock);
        editBlock(pageId, editedBlock);
        setAllComments && setAllComments(blockComments);
      }
    },
    [commentBlock, editBlock, pageId, selectedHtml, setAllComments]
  );
  const findMainCommentIndex = (
    comments: MainCommentType[],
    mainComment: MainCommentType
  ) => {
    const commentsId = comments.map((m: MainCommentType) => m.id);
    const mainCommentIndex = commentsId.indexOf(mainComment.id);
    return mainCommentIndex;
  };
  const findMainComment = useCallback((): {
    mainComment: MainCommentType;
    mainCommentIndex: number;
  } => {
    const sub = subComment as SubCommentType;
    const comments = [...(allComments as MainCommentType[])];
    const mainComment = comments.filter((m: MainCommentType) =>
      m.subCommentsId?.includes(sub.id)
    )[0];
    const mainCommentIndex = findMainCommentIndex(comments, mainComment);
    return {
      mainComment: mainComment,
      mainCommentIndex: mainCommentIndex,
    };
  }, [allComments, subComment]);

  const onInputText = useCallback((event: FormEvent<HTMLInputElement>) => {
    const target = event?.currentTarget;
    const value = target.value;
    setText(value);
    if (value === null || value === "") {
      setSubmitStyle({
        fill: "grey",
        border: "none",
      });
    } else {
      setSubmitStyle({
        fill: " rgb(46, 170, 220)",
      });
    }
  }, []);
  const addMainComment = useCallback(() => {
    const editTime = getEditTime();
    if (commentBlock) {
      const newId = `main_${editTime}`;
      if (selectedHtml) {
        selectedHtml.className = `text_commentBtn mainId_${newId}`;
      }
      const newBlockComment: MainCommentType = {
        id: newId,
        userName: userName,
        editTime: editTime,
        createTime: editTime,
        content: text,
        selectedText: !selectedHtmlText ? null : selectedHtmlText,
        subComments: null,
        subCommentsId: null,
        type: "open",
      };
      const newBlockComments =
        allComments === null
          ? [newBlockComment]
          : allComments.concat(newBlockComment);
      updateBlock(newBlockComments);
    }
  }, [
    allComments,
    commentBlock,
    selectedHtml,
    selectedHtmlText,
    text,
    updateBlock,
    userName,
  ]);

  const addSubComment = useCallback(() => {
    const editTime = getEditTime();

    if (commentBlock && allComments && mainComment) {
      const comments = [...allComments];
      const mainCommentIndex = findMainCommentIndex(comments, mainComment);
      const newSubComment: SubCommentType = {
        id: `sub_${editTime}`,
        userName: userName,
        content: text,
        editTime: editTime,
        createTime: editTime,
      };
      const editedMainComment: MainCommentType = {
        ...mainComment,
        subComments: !mainComment.subComments
          ? [newSubComment]
          : mainComment.subComments.concat(newSubComment),
        subCommentsId: !mainComment.subCommentsId
          ? [newSubComment.id]
          : mainComment.subCommentsId.concat(newSubComment.id),
        editTime: editTime,
      };
      comments.splice(mainCommentIndex, 1, editedMainComment);
      updateBlock(comments);
    }
  }, [allComments, commentBlock, mainComment, text, updateBlock, userName]);

  const updatePageComment = useCallback(
    (pageComments: MainCommentType[] | null) => {
      const editTime = getEditTime();

      if (page) {
        const editedPage: Page = {
          ...page,
          header: {
            ...page.header,
            comments: pageComments,
          },
          editTime: editTime,
        };
        setAllComments && setAllComments(pageComments);
        if (editPage) {
          editPage(pageId, editedPage);
        }
      }
    },
    [editPage, page, pageId, setAllComments]
  );

  const addPageMainComment = useCallback(() => {
    const editTime = getEditTime();
    const newComment: MainCommentType = {
      id: `pageComment_${editTime}`,
      userName: userName,
      content: text,
      editTime: editTime,
      createTime: editTime,
      type: "open",
      selectedText: null,
      subComments: null,
      subCommentsId: null,
    };
    const newPageComments: MainCommentType[] | null =
      page.header.comments === null
        ? [newComment]
        : page.header.comments.concat(newComment);
    updatePageComment(newPageComments);
  }, [page.header.comments, text, updatePageComment, userName]);

  const addPageSubComment = useCallback(() => {
    const editTime = getEditTime();

    if (allComments && mainComment) {
      const comments = [...allComments];
      const mainCommentIndex = findMainCommentIndex(comments, mainComment);
      const newSubComment: SubCommentType = {
        id: `subComment_${editTime}`,
        userName: userName,
        content: text,
        editTime: editTime,
        createTime: editTime,
      };
      const editedMainComment: MainCommentType = {
        ...mainComment,
        subComments:
          mainComment.subComments === null
            ? [newSubComment]
            : mainComment.subComments?.concat(newSubComment),
        subCommentsId:
          mainComment.subCommentsId === null
            ? [newSubComment.id]
            : mainComment.subCommentsId.concat(newSubComment.id),
      };
      comments.splice(mainCommentIndex, 1, editedMainComment);
      updatePageComment(comments);
    }
  }, [allComments, mainComment, text, updatePageComment, userName]);

  const closeInput = useCallback(() => {
    setEdit && setEdit(false);
    setText("");

    if (!commentInputRef.current?.closest(".comments") && setModal) {
      setModal({
        open: false,
        block: undefined,
        target: undefined,
      });
    }
  }, [setEdit, setModal, commentInputRef]);

  const recoveryInputAfterSubmit = useCallback(() => {
    setText("");
    closeInput();
    page && setOriginTemplateItem(page);
    setEditTargetComment(null);
    sessionStorage.removeItem(SESSION_KEY.editComment);
  }, [closeInput, page]);

  const makeNewComment = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (commentBlock) {
        !mainComment ? addMainComment() : addSubComment();
      } else {
        !mainComment ? addPageMainComment() : addPageSubComment();
      }
      recoveryInputAfterSubmit();
    },
    [
      addMainComment,
      addPageMainComment,
      addPageSubComment,
      addSubComment,
      commentBlock,
      mainComment,
      recoveryInputAfterSubmit,
    ]
  );

  const editMainComment = useCallback(() => {
    if (commentBlock && allComments && mainComment) {
      const comments = [...allComments];
      const mainCommentIds = comments.map((m: MainCommentType) => m.id);
      const mainCommentIndex = mainCommentIds.indexOf(mainComment.id);
      const editedBlockComment: MainCommentType = {
        ...mainComment,
        content: text,
        editTime: getEditTime(),
      };
      comments.splice(mainCommentIndex, 1, editedBlockComment);
      updateBlock(comments);
    }
  }, [allComments, commentBlock, mainComment, text, updateBlock]);

  const editSubComment = useCallback(() => {
    if (commentBlock && allComments && subComment) {
      const comments = [...allComments];
      const { mainComment, mainCommentIndex } = findMainComment();
      const subIndex = mainComment.subCommentsId?.indexOf(
        subComment.id
      ) as number;
      const editedSubComment: SubCommentType = {
        ...subComment,
        content: text,
        editTime: getEditTime(),
      };
      mainComment.subComments?.splice(subIndex, 1, editedSubComment);
      comments.splice(mainCommentIndex, 1, mainComment);
      updateBlock(comments);
    }
  }, [
    allComments,
    commentBlock,
    findMainComment,
    subComment,
    text,
    updateBlock,
  ]);

  const editPageComment = useCallback(() => {
    if (allComments && mainComment) {
      const comments = [...allComments];
      const mainCommentsId = allComments.map((m: MainCommentType) => m.id);
      const mainCommentIndex = mainCommentsId.indexOf(mainComment.id);
      const editedMainComment: MainCommentType = {
        ...mainComment,
        content: text,
        editTime: getEditTime(),
      };
      comments.splice(mainCommentIndex, 1, editedMainComment);
      updatePageComment(comments);
    }
  }, [allComments, mainComment, text, updatePageComment]);

  const editPageSubComment = useCallback(() => {
    if (allComments && subComment) {
      const comments = [...allComments];
      const { mainComment, mainCommentIndex } = findMainComment();
      const subIndex = mainComment.subCommentsId?.indexOf(subComment.id);
      if (subIndex) {
        const editedSubComment: SubCommentType = {
          ...subComment,
          content: text,
          editTime: getEditTime(),
        };
        mainComment.subComments?.splice(subIndex, 1, editedSubComment);
        comments.splice(mainCommentIndex, 1, mainComment);
        updatePageComment(comments);
      }
    }
  }, [allComments, findMainComment, subComment, text, updatePageComment]);

  const editComment = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      if (commentBlock) {
        mainComment ? editMainComment() : editSubComment();
      } else {
        mainComment ? editPageComment() : editPageSubComment();
      }
      recoveryInputAfterSubmit();
    },
    [
      commentBlock,
      editMainComment,
      editPageComment,
      editPageSubComment,
      editSubComment,
      mainComment,
      recoveryInputAfterSubmit,
    ]
  );

  const openDiscardEdit = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (setOpenDiscardEdit) setOpenDiscardEdit(true);
    },
    [setOpenDiscardEdit]
  );

  useEffect(() => {
    switch (addOrEdit) {
      case "add":
        if (mainComment) {
          //add new subComment to mainComment
          setPlaceHolder(REPLY);
        } else {
          //make new mainComment
          setPlaceHolder(MAKING_MAIN);
        }
        break;
      case "edit":
        if (subComment) {
          setEditTargetComment(subComment);
          setPlaceHolder(subComment.content);
        } else {
          setEditTargetComment(mainComment);
          setPlaceHolder(mainComment?.content);
        }
        break;
      default:
        break;
    }
  }, [mainComment, subComment, addOrEdit]);
  return (
    <div
      className={addOrEdit === "edit" ? "comment-input edit" : "comment-input"}
      ref={commentInputRef}
    >
      {addOrEdit === "add" && (
        <div className="first-letter">
          <div className="inner">
            <span>{userNameFirstLetter}</span>
          </div>
        </div>
      )}
      <form>
        <label>
          <ScreenOnly text="comment input" />
          <input
            type="text"
            title="comment input"
            placeholder={placeHolder}
            name="comment"
            onInput={onInputText}
            value={text}
          />
        </label>
        {addOrEdit === "edit" && (
          <button className="btn-cancel-edit" onClick={openDiscardEdit}>
            <ScreenOnly text="button to cancel edit" />
            <IoMdCloseCircle />
          </button>
        )}
        <button
          onClick={addOrEdit === "add" ? makeNewComment : editComment}
          className="comment__btn-submit"
          name="comment__btn-submit"
          disabled={!text}
        >
          {addOrEdit === "edit" ? (
            <>
              <ScreenOnly text="button to edit comment" />
              <IoCheckmarkCircle style={submitStyle} />
            </>
          ) : (
            <>
              <ScreenOnly text="button to add comment" />
              <IoArrowUpCircleSharp style={submitStyle} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default React.memo(CommentInput);
