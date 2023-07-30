import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  MouseEvent,
  useContext,
  useCallback,
} from "react";
import { CSSProperties } from "styled-components";
import { Block, MainCommentType, Page } from "../modules/notion/type";
import { ActionContext } from "../route/NotionRouter";
import Comment from "./Comment";
import CommentToolMore from "./CommentToolMore";

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
  const closeToolMore = useCallback(
    (event: MouseEvent | globalThis.MouseEvent) => {
      if (moreOpen) {
        const target = event.target as HTMLElement | null;
        const isInToolMore = target?.closest("#tool-more");
        if (!isInToolMore) {
          setMoreOpen(false);
          sessionStorage.removeItem("toolMoreItem");
        }
      }
    },
    [moreOpen]
  );

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
  const changeCommentsStyle = useCallback(() => {
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
  }, [block, frameHtml, openComment]);

  useEffect(() => {
    openComment ? changeCommentsStyle() : setCommentsStyle(undefined);
  }, [openComment, changeCommentsStyle]);

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

  useEffect(() => {
    inner?.addEventListener("click", closeToolMore);

    return () => {
      inner?.removeEventListener("click", closeToolMore);
    };
  }, [inner, closeToolMore]);

  useEffect(() => {
    window.addEventListener("resize", changeCommentsStyle);
    return () => window.removeEventListener("resize", changeCommentsStyle);
  }, [changeCommentsStyle]);

  return (
    <>
      <div
        id={openComment ? "block-comments" : undefined}
        className="comments"
        ref={commentsRef}
        style={commentsStyle}
      >
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
        <CommentToolMore
          toolMoreStyle={toolMoreStyle}
          page={page}
          pageId={pageId}
          blockId={block ? block.id : null}
          editBlock={editBlock}
          editPage={editPage}
          setAllComments={setAllComments}
          setMoreOpen={setMoreOpen}
          templateHtml={templateHtml}
        />
      )}
    </>
  );
};

export default React.memo(Comments);
