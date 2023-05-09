import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  MouseEvent,
  useContext,
} from "react";
import { CSSProperties } from "styled-components";
import {
  Block,
  MainCommentType,
  SubCommentType,
  Page,
} from "../modules/notion";
import { BsThreeDots } from "react-icons/bs";
import { HiOutlinePencil } from "react-icons/hi";
import {
  IoArrowUpCircleSharp,
  IoCheckmarkCircle,
  IoTrashOutline,
} from "react-icons/io5";
import Time from "./Time";
import { detectRange } from "./BlockFn";
import { ModalType } from "../containers/EditorContainer";
import { IoMdCloseCircle } from "react-icons/io";
import { setTemplateItem } from "./BlockComponent";
import { removeSelected } from "./BlockStyler";
import { ActionContext } from "../containers/NotionRouter";
const open = "open";
const resolve = "resolve";
type CommentsProps = {
  /**
   *block===null 이면 page에 대한 comments, block !==null 이면 block에 대한 comments
   */
  block: Block | null;
  page: Page;
  pageId: string;
  userName: string;
  frameHtml: HTMLElement | null;
  openComment: boolean;
  /**
   * 사용자가 보고 싶어하는 comment의 type  유형 , select===null 이면 모든 comments를 보여주고 null 이 기본값
   */
  select: null | typeof open | typeof resolve;
  /**
   * comment를 수정하는 중, 사용자가 수정사항을 삭제하려고 하는 지를 판단할 수 있는 property
   */
  discardEdit: boolean;
  /**
   * comment의 수정사항을 삭제한 후, discardEdit을 원래의 기본값으로 돌리는 데 사용
   */
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
  /**
   *showAllComments === true이면 AllComments안의 comments, showAllComments이면 frame안에 있는 page, block에 대한 comments로, ToolMore의 위치를 지정하는데 사용함
   */
  showAllComments: boolean;
};
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
type CommentBlockProps = {
  comment: SubCommentType | MainCommentType;
  mainComment: boolean;
  block: Block | null;
  page: Page;
  pageId: string;
  userName: string;
  editBlock: (pageId: string, block: Block) => void;
  editPage: ((pageId: string, newPage: Page) => void) | null;
  frameHtml: HTMLElement | null;
  allComments: MainCommentType[] | null;
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>> | null;
  moreOpen: boolean;
  setMoreOpen: Dispatch<SetStateAction<boolean>>;
  setToolMoreStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  setModal: Dispatch<SetStateAction<ModalType>> | null;
  discardEdit: boolean;
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
  templateHtml: HTMLElement | null;
  showAllComments: boolean;
};

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

type ResolveBtnProps = {
  comment: MainCommentType;
};
type ToolMoreProps = {
  pageId: string;
  page: Page;
  block: Block | null;
  editBlock: (pageId: string, block: Block) => void;
  editPage: ((pageId: string, newPage: Page) => void) | null;
  allComments: MainCommentType[] | null;
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>> | null;
  setMoreOpen: Dispatch<SetStateAction<boolean>>;
  toolMoreStyle: CSSProperties | undefined;
  templateHtml: HTMLElement | null;
};
const closeToolMore = (
  event: MouseEvent | globalThis.MouseEvent,
  setMoreOpen: Dispatch<SetStateAction<boolean>>
) => {
  const toolMore = document.getElementById("tool_more");
  const toolMoreArea = toolMore?.getClientRects()[0];
  const isInToolMore = detectRange(event, toolMoreArea);
  if (!isInToolMore) {
    setMoreOpen(false);
    sessionStorage.removeItem("toolMoreItem");
  }
};

export const CommentInput = ({
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
        <input
          type="text"
          title="comment input"
          placeholder={placeHolder}
          name="comment"
          onInput={onInputText}
          value={text}
        />
        {addOrEdit === "edit" && (
          <button
            className="btn-cancel-edit"
            onClick={(event) => openDiscardEdit(event)}
          >
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
            <IoCheckmarkCircle style={submitStyle} />
          ) : (
            <IoArrowUpCircleSharp style={submitStyle} />
          )}
        </button>
      </form>
    </div>
  );
};

const ToolMore = ({
  pageId,
  block,
  page,
  editBlock,
  editPage,
  allComments,
  setAllComments,
  setMoreOpen,
  toolMoreStyle,
  templateHtml,
}: ToolMoreProps) => {
  const toolMoreItem = sessionStorage.getItem("toolMoreItem");
  const [comment, setComment] = useState<
    MainCommentType | SubCommentType | null
  >(null);
  const editTime = JSON.stringify(Date.now());

  const onClickDeleteComment = () => {
    page && setTemplateItem(templateHtml, page);
    setMoreOpen(false);
    //page.header.comments 가 아닐 경우
    if (block) {
      //delete blockComment
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
            comments: blockComments[0] === undefined ? null : blockComments,
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
    sessionStorage.removeItem("toolMoreItem");
  };

  const onClickEditComment = () => {
    setMoreOpen(false);
    comment && sessionStorage.setItem("editComment", comment.id);
    sessionStorage.removeItem("toolMoreItem");
  };
  useEffect(() => {
    if (toolMoreItem) {
      const item = JSON.parse(toolMoreItem);
      setComment(item);
    }
  }, [toolMoreItem]);
  return (
    <div id="tool_more" style={toolMoreStyle}>
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
  const ResolveBtn = ({ comment }: ResolveBtnProps) => {
    const changeToResolve = () => {
      if (page) {
        setTemplateItem(templateHtml, page);
      }
      const editTime = JSON.stringify(Date.now());
      const newComment: MainCommentType = {
        ...comment,
        type: "resolve",
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
            type: "resolve",
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
    };

    return (
      <button className="comment__tool-resolve" onClick={changeToResolve}>
        <span>Resolve</span>
      </button>
    );
  };
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
      {mainComment && <ResolveBtn comment={comment as MainCommentType} />}
      <button
        className="comment__tool-more"
        onClick={
          !moreOpen ? (event) => openToolMore(event) : () => setMoreOpen(false)
        }
      >
        <span>
          <BsThreeDots />
        </span>
      </button>
    </div>
  );
};

const CommentBlock = ({
  comment,
  mainComment,
  block,
  page,
  pageId,
  userName,
  editBlock,
  editPage,
  setModal,
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
}: CommentBlockProps) => {
  const firstLetter = comment.userName.substring(0, 1).toUpperCase();
  const [edit, setEdit] = useState<boolean>(false);
  const editCommentItem = sessionStorage.getItem("editComment");
  const targetMainComment = mainComment ? (comment as MainCommentType) : null;
  const blockContentEl = document.getElementById(
    `${block?.id}__contents`
  )?.textContent;
  useEffect(() => {
    // discard edit
    if (editCommentItem) {
      if (discardEdit) {
        setEdit(false);
        sessionStorage.removeItem("editComment");
        setDiscardEdit(false);
      } else {
        comment.id === editCommentItem && setEdit(true);
      }
    }
  }, [editCommentItem, comment.id, discardEdit]);
  return (
    <div className="commentBlock">
      <section className="commentBlock__header">
        <div className="information">
          <div className="firstLetter">
            <div>{firstLetter}</div>
          </div>
          <div className="userName">{comment.userName}</div>
          <Time editTime={comment.editTime} />
        </div>
        <CommentTool
          mainComment={mainComment}
          comment={comment}
          block={block}
          page={page}
          pageId={pageId}
          editBlock={editBlock}
          editPage={editPage}
          frameHtml={frameHtml}
          setAllComments={setAllComments}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
          templateHtml={templateHtml}
          showAllComments={showAllComments}
        />
      </section>
      {mainComment && (
        <section className="commentBlock__mainComment">
          <div className="commentBlock__mainComment_line"></div>
          {block && (
            <div className="commentBlock__mainComment_content">
              {targetMainComment?.selectedText
                ? targetMainComment?.selectedText
                : blockContentEl}
            </div>
          )}
        </section>
      )}
      <section className="comment__contents">
        {edit ? (
          <CommentInput
            userName={userName}
            pageId={pageId}
            page={page}
            mainComment={!mainComment ? null : (comment as MainCommentType)}
            subComment={!mainComment ? (comment as SubCommentType) : null}
            editBlock={editBlock}
            editPage={editPage}
            commentBlock={block}
            allComments={allComments}
            setAllComments={setAllComments}
            setModal={setModal}
            addOrEdit="edit"
            setEdit={setEdit}
            templateHtml={templateHtml}
            frameHtml={frameHtml}
          />
        ) : (
          comment.content
        )}
      </section>
    </div>
  );
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
const Comments = ({
  pageId,
  block,
  page,
  userName,
  frameHtml,
  openComment,
  select,
  discardEdit,
  setDiscardEdit,
  showAllComments,
}: CommentsProps) => {
  const { editBlock, editPage } = useContext(ActionContext).actions;
  const inner = document.getElementById("inner");
  const pageComments = page.header.comments;
  const [commentsStyle, setCommentsStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [allComments, setAllComments] = useState<MainCommentType[] | null>(
    null
  );
  const [targetComments, setTargetComment] = useState<MainCommentType[] | null>(
    null
  );
  const [resolveComments, setResolveComments] = useState<
    MainCommentType[] | null
  >(null);
  const [openComments, setOpenComments] = useState<MainCommentType[] | null>(
    null
  );
  const [moreOpen, setMoreOpen] = useState<boolean>(false);
  const [toolMoreStyle, setToolMoreStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const templateHtml = document.getElementById("template");
  const commentsRef = useRef<HTMLDivElement>(null);
  const showComments = (what: "open" | "resolve") => {
    what === "open"
      ? setTargetComment(openComments)
      : setTargetComment(resolveComments);
  };
  const updateOpenAndResolveComments = (comments: MainCommentType[]) => {
    setResolveComments(
      comments?.filter((comment: MainCommentType) => comment.type === "resolve")
    );
    setOpenComments(
      comments?.filter((comment: MainCommentType) => comment.type === "open")
    );
  };
  /**
   * frame 에서 block-comments를 열었을때 (openComment === true) block의 위치에 따라 commentsStyle을 설정하는 함수
   */
  function changeCommentsStyle() {
    if (block && openComment) {
      const blockContentsEl = document.getElementById(`${block.id}__contents`);
      const editableBlock = document.getElementsByClassName("editableBlock")[0];
      const editableBlockDomRect = editableBlock.getClientRects()[0];
      const blockDocDomRect = blockContentsEl?.getClientRects()[0];
      if (blockDocDomRect && frameHtml) {
        const frameDomRect = frameHtml.getClientRects()[0];
        const pageTitleHtml = frameHtml.querySelector(
          ".page__title"
        ) as HTMLElement;
        const pageTitleBottom = pageTitleHtml.getClientRects()[0].bottom;
        const padding = window
          .getComputedStyle(editableBlock, null)
          .getPropertyValue("padding-right");
        const pxIndex = padding.indexOf("px");
        const paddingValue = Number(padding.slice(0, pxIndex));
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        const top = blockDocDomRect.bottom;
        const overHeight = top + 200 >= window.innerHeight;
        const bottom = innerHeight - blockDocDomRect.top + 10;
        const left =
          innerWidth >= 768
            ? editableBlockDomRect.x - frameDomRect.x
            : innerWidth * 0.1;
        const width =
          innerWidth >= 768
            ? editableBlock.clientWidth - paddingValue
            : innerWidth * 0.8;

        const basicStyle: CSSProperties = {
          display: "flex",
          left: left,
          width: width,
        };
        const style: CSSProperties = overHeight
          ? {
              ...basicStyle,
              bottom: bottom,
              maxHeight: blockDocDomRect.top - pageTitleBottom,
            }
          : {
              ...basicStyle,
              top: top,
              maxHeight: frameDomRect.height - top,
            };
        setCommentsStyle(style);
      }
    }
  }

  useEffect(() => {
    openComment ? changeCommentsStyle() : setCommentsStyle(undefined);
  }, [openComment]);

  useEffect(() => {
    if (block?.comments) {
      const item = sessionStorage.getItem("mainCommentId");
      if (item === null) {
        setAllComments(block.comments);
      } else {
        setAllComments(
          block.comments.filter((mainComment) => mainComment.id === item)
        );
        sessionStorage.removeItem("mainCommentId");
      }
    } else {
      setAllComments(pageComments);
    }
  }, [block, page, pageComments]);

  useEffect(() => {
    if (allComments) {
      updateOpenAndResolveComments(allComments);
    } else {
      setTargetComment(null);
    }
  }, [allComments]);
  useEffect(() => {
    if (select) {
      select === open
        ? setTargetComment(openComments)
        : setTargetComment(resolveComments);
    } else {
      setTargetComment(openComments);
      if (commentsRef.current) {
        openComments === null || openComments[0] === undefined
          ? commentsRef.current.parentElement?.setAttribute(
              "style",
              "display:none"
            )
          : commentsRef.current.parentElement?.setAttribute(
              "style",
              "display:block"
            );
      }
    }
  }, [select, openComments, resolveComments]);

  inner?.addEventListener("click", (event) => {
    if (moreOpen) {
      closeToolMore(event, setMoreOpen);
    }
  });
  window.onresize = changeCommentsStyle;
  return (
    <>
      <div
        id={openComment ? "block-comments" : undefined}
        className="comments"
        ref={commentsRef}
        style={commentsStyle}
      >
        {resolveComments && resolveComments.length > 0 && !select && (
          <section className="comments__btn-group-type">
            <button id="openTypeBtn" onClick={() => showComments("open")}>
              <span>Open</span>
              <span>{`(${openComments?.length})`}</span>
            </button>
            <button id="resolveTypeBtn" onClick={() => showComments("resolve")}>
              <span>Resolve</span>
              <span>{`(${resolveComments?.length})`}</span>
            </button>
          </section>
        )}
        {targetComments && (
          <section className="comments__comments-group">
            {targetComments.map((comment: MainCommentType) => (
              <Comment
                key={`comment_${comment.id}`}
                userName={userName}
                comment={comment}
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
                discardEdit={discardEdit}
                setDiscardEdit={setDiscardEdit}
                templateHtml={templateHtml}
                showAllComments={showAllComments}
              />
            ))}
          </section>
        )}
      </div>
      {moreOpen && (
        <ToolMore
          toolMoreStyle={toolMoreStyle}
          page={page}
          pageId={pageId}
          block={block}
          editBlock={editBlock}
          editPage={editPage}
          allComments={allComments}
          setAllComments={setAllComments}
          setMoreOpen={setMoreOpen}
          templateHtml={templateHtml}
        />
      )}
    </>
  );
};

export default React.memo(Comments);
