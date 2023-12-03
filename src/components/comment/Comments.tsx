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

import { Comment, CommentToolMore } from "../index";

import { Block, MainCommentType, Page } from "../../types";
import { ActionContext } from "../../contexts";
import { SESSION_KEY } from "../../constants";

type CommentsProps = {
  /**
   * Comments에서 보여줄 mainComments
   */
  targetMainComments: MainCommentType[];
  /**
   *block=== undefined 이면 page에 대한 comments, 그렇지 않으면 block에 대한 comments
   */
  block?: Block;
  page: Page;
  pageId: string;
  userName: string;
  frameHtml: HTMLElement | null;
  openComment: boolean;
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
  changeStateToCloseBlockComments?: () => void;
};

const Comments = ({
  targetMainComments,
  pageId,
  block,
  page,
  userName,
  frameHtml,
  openComment,
  discardEdit,
  setDiscardEdit,
  showAllComments,
  changeStateToCloseBlockComments,
}: CommentsProps) => {
  const { editBlock, editPage } = useContext(ActionContext).actions;
  const inner = document.getElementById("inner");
  const [commentsStyle, setCommentsStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [allComments, setAllComments] = useState<MainCommentType[] | null>(
    targetMainComments
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
          sessionStorage.removeItem(SESSION_KEY.toolMoreItem);
        }
      }
    },
    [moreOpen]
  );

  /**
   * frame 에서 block-comments를 열었을때 (openComment === true) block의 위치에 따라 commentsStyle을 설정하는 함수
   */
  const changeCommentsStyle = useCallback(() => {
    const MAX_HEIGHT_OF_COMMENTS = 160;
    const EXTRA_SPACE = 30;
    if (block && openComment) {
      const topBarHeight = document.querySelector(".topBar")?.clientHeight;
      const blockContentsEl = document.getElementById(`${block.id}__contents`);
      const editableBlock = document.getElementsByClassName("editableBlock")[0];
      const editableBlockDomRect = editableBlock.getClientRects()[0];
      const blockDocDomRect = blockContentsEl?.getClientRects()[0];
      if (blockDocDomRect && frameHtml && topBarHeight) {
        const frameDomRect = frameHtml.getClientRects()[0];
        const pageTitleHtml = frameHtml.querySelector(
          ".page__title"
        ) as HTMLElement;
        const pageTitleBottom = pageTitleHtml.getClientRects()[0].bottom;
        const padding = window
          .getComputedStyle(editableBlock, null)
          .getPropertyValue("padding-right");
        const paddingValue = Number(padding.replace("px", ""));
        const innerWidth = window.innerWidth;
        /**
         * 뷰포트를 기준으로 한 comment의 y좌표
         */
        const y = blockDocDomRect.bottom;
        const top = y - topBarHeight + frameHtml.scrollTop;
        const overHeight = y + MAX_HEIGHT_OF_COMMENTS >= window.innerHeight;

        const bottom = window.innerHeight - blockDocDomRect.top + 10;
        const left =
          innerWidth > 768
            ? editableBlockDomRect.x - frameDomRect.x
            : innerWidth * 0.1;
        const width =
          innerWidth > 768
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
              maxHeight: y - pageTitleBottom - EXTRA_SPACE,
            }
          : {
              ...basicStyle,
              top: top,
              maxHeight: window.innerHeight - y - EXTRA_SPACE,
            };
        setCommentsStyle(style);
      }
    }
  }, [block, frameHtml, openComment]);

  useEffect(() => {
    changeCommentsStyle();
  }, [changeCommentsStyle]);

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

  useEffect(() => {
    if (!allComments && changeStateToCloseBlockComments)
      changeStateToCloseBlockComments();
  }, [allComments, changeStateToCloseBlockComments]);

  return (
    <>
      <div
        id={openComment ? "block-comments" : undefined}
        className="comments"
        ref={commentsRef}
        style={commentsStyle}
      >
        {allComments && (
          <section className="comments__comments-group">
            {allComments.map((comment: MainCommentType) => (
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
