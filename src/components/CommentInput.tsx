import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
  MouseEvent,
  useEffect,
} from "react";
import {
  Block,
  MainCommentType,
  Page,
  SubCommentType,
} from "../modules/notion";
import { ModalType } from "../containers/EditorContainer";
import { CSSProperties } from "styled-components";
import { removeSelected } from "../fn";
import { setTemplateItem } from "../fn";
import ScreenOnly from "./ScreenOnly";
import { IoMdCloseCircle } from "react-icons/io";
import { IoArrowUpCircleSharp, IoCheckmarkCircle } from "react-icons/io5";
type CommentInputProps = {
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
  editBlock: (pageId: string, block: Block) => void | null;
  editPage: ((pageId: string, newPage: Page) => void) | null;
  commentBlock: Block | null;
  /**
   * block의 comments 이거나 page.header.comments
   */
  allComments: MainCommentType[] | null;
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>> | null;
  setModal: Dispatch<SetStateAction<ModalType>> | null;
  setEdit: Dispatch<SetStateAction<boolean>> | null;
  templateHtml: HTMLElement | null;
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
  setEdit,
  templateHtml,
  frameHtml,
}: CommentInputProps) => {
  const editTime = JSON.stringify(Date.now());
  const userNameFirstLetter = userName.substring(0, 1).toUpperCase();
  const [editTargetComment, setEditTargetComment] = useState<
    MainCommentType | SubCommentType | null
  >(null);
  const reply = "Reply...";
  const changing = editTargetComment?.content;
  const makingMain = "Add a comment";
  type situationType = typeof reply | typeof changing | typeof makingMain;
  const [placeHolder, setPlaceHolder] = useState<situationType>(makingMain);
  const [submitStyle, setSubmitStyle] = useState<CSSProperties>({
    fill: "#a3a3a2",
    border: "none",
  });
  const [text, setText] = useState<string>("");
  const selectedHtml = document.querySelector(".selected");

  const selectedHtmlText = selectedHtml?.innerHTML;

  const updateBlock = (blockComments: MainCommentType[]) => {
    if (commentBlock) {
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
      editBlock(pageId, editedBlock);
      setAllComments && setAllComments(blockComments);
      if (selectedHtml) {
        removeSelected(frameHtml, editedBlock, editBlock, page, null);
      }
    }
  };
  const findMainCommentIndex = (
    comments: MainCommentType[],
    mainComment: MainCommentType
  ) => {
    const commentsId = comments.map((m: MainCommentType) => m.id);
    const mainCommentIndex = commentsId.indexOf(mainComment.id);
    return mainCommentIndex;
  };
  const findMainComment = (): {
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
  };

  const onInputText = (event: FormEvent<HTMLInputElement>) => {
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
  };
  const addMainComment = () => {
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
        selectedText: selectedHtmlText === undefined ? null : selectedHtmlText,
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
  };

  const addSubComment = () => {
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
        subComments:
          mainComment.subComments === null
            ? [newSubComment]
            : mainComment.subComments.concat(newSubComment),
        subCommentsId:
          mainComment.subCommentsId === null
            ? [newSubComment.id]
            : mainComment.subCommentsId.concat(newSubComment.id),
        editTime: editTime,
      };
      comments.splice(mainCommentIndex, 1, editedMainComment);
      updateBlock(comments);
    }
  };
  const updatePageComment = (pageComments: MainCommentType[] | null) => {
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
  };
  const addPageMainComment = () => {
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
  };
  const addPageSubComment = () => {
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
  };
  const recoveryInputAfterSubmit = () => {
    setText("");
    closeInput();
    page && setTemplateItem(templateHtml, page);
    setEditTargetComment(null);
    sessionStorage.removeItem("editComment");
  };

  const makeNewComment = (event: MouseEvent) => {
    event.preventDefault();
    if (commentBlock) {
      mainComment === null ? addMainComment() : addSubComment();
    } else {
      mainComment === null ? addPageMainComment() : addPageSubComment();
    }
    recoveryInputAfterSubmit();
  };

  const editMainComment = () => {
    if (commentBlock && allComments && mainComment) {
      const comments = [...allComments];
      const mainCommentIds = comments.map((m: MainCommentType) => m.id);
      const mainCommentIndex = mainCommentIds.indexOf(mainComment.id);
      const editedBlockComment: MainCommentType = {
        ...mainComment,
        content: text,
        editTime: editTime,
      };
      comments.splice(mainCommentIndex, 1, editedBlockComment);
      updateBlock(comments);
    }
  };

  const editSubComment = () => {
    if (commentBlock && allComments && subComment) {
      const comments = [...allComments];
      const { mainComment, mainCommentIndex } = findMainComment();
      const subIndex = mainComment.subCommentsId?.indexOf(
        subComment.id
      ) as number;
      const editedSubComment: SubCommentType = {
        ...subComment,
        content: text,
        editTime: editTime,
      };
      mainComment.subComments?.splice(subIndex, 1, editedSubComment);
      comments.splice(mainCommentIndex, 1, mainComment);
      updateBlock(comments);
    }
  };

  const editPageComment = () => {
    if (allComments && mainComment) {
      const comments = [...allComments];
      const mainCommentsId = allComments.map((m: MainCommentType) => m.id);
      const mainCommentIndex = mainCommentsId.indexOf(mainComment.id);
      const editedMainComment: MainCommentType = {
        ...mainComment,
        content: text,
        editTime: editTime,
      };
      comments.splice(mainCommentIndex, 1, editedMainComment);
      updatePageComment(comments);
    }
  };

  const editPageSubComment = () => {
    if (allComments && subComment) {
      const comments = [...allComments];
      const { mainComment, mainCommentIndex } = findMainComment();
      const subIndex = mainComment.subCommentsId?.indexOf(subComment.id);
      if (subIndex) {
        const editedSubComment: SubCommentType = {
          ...subComment,
          content: text,
          editTime: editTime,
        };
        mainComment.subComments?.splice(subIndex, 1, editedSubComment);
        comments.splice(mainCommentIndex, 1, mainComment);
        updatePageComment(comments);
      }
    }
  };
  const editComment = (event: MouseEvent) => {
    event.preventDefault();
    if (commentBlock) {
      mainComment ? editMainComment() : editSubComment();
    } else {
      mainComment ? editPageComment() : editPageSubComment();
    }
    recoveryInputAfterSubmit();
  };
  const openDiscardEdit = (event: MouseEvent) => {
    event.preventDefault();
    const discardEdit = document.getElementById("discardEdit");
    discardEdit?.classList.add("on");
  };
  function closeInput() {
    setEdit && setEdit(false);
    setText("");
    setModal &&
      setModal({
        open: false,
        what: null,
      });
  }
  useEffect(() => {
    switch (addOrEdit) {
      case "add":
        if (mainComment) {
          //add new subComment to mainComment
          setPlaceHolder(reply);
        } else {
          //make new mainComment
          setPlaceHolder(makingMain);
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
      className={
        addOrEdit === "edit" ? "commentInput editComment" : "commentInput"
      }
    >
      {addOrEdit === "add" && (
        <div className="firstLetter">
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
          <button
            className="btn-cancel-edit"
            onClick={(event) => openDiscardEdit(event)}
          >
            <ScreenOnly text="button to cancel edit" />
            <IoMdCloseCircle />
          </button>
        )}
        <button
          onClick={
            addOrEdit === "add"
              ? (event) => makeNewComment(event)
              : (event) => editComment(event)
          }
          className="comment__btn-submit"
          name="comment__btn-submit"
          disabled={text === null || text === ""}
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
