import React, {
  useEffect,
  useRef,
  useState,
  MouseEvent,
  useContext,
  useCallback,
} from "react";

import { CSSProperties } from "styled-components";

import { Comment, CommentToolMore, DiscardEditModal } from "../index";

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
};

const Comments = ({ ...props }: CommentsProps) => {
  const { targetMainComments, block, frameHtml } = props;

  const { editBlock, editPage } = useContext(ActionContext).actions;
  const inner = document.getElementById("notion__inner");

  const [openDiscardEdit, setOpenDiscardEdit] = useState<boolean>(false);
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

  const discardEdit = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY.editComment);
  }, []);

  const closeToolMore = useCallback(
    (event: MouseEvent | globalThis.MouseEvent) => {
      if (moreOpen) {
        const target = event.target as HTMLElement | null;
        const isInToolMore = target?.closest(".comment__tool-more");
        if (!isInToolMore) {
          setMoreOpen(false);
          sessionStorage.removeItem(SESSION_KEY.toolMoreItem);
        }
      }
    },
    [moreOpen]
  );

  /**
   * frame 에서 block-comments를 열었을때 block의 위치에 따라 commentsStyle을 설정하는 함수
   */
  const changeCommentsStyle = useCallback(() => {
    const MAX_HEIGHT_OF_COMMENTS = 160;
    const EXTRA_SPACE = 30;
    if (block) {
      const topBarHeight = document.querySelector("#top-bar")?.clientHeight;
      const blockContentsEl = document.getElementById(`${block.id}__contents`);
      const editableBlock = document.getElementsByClassName("editableBlock")[0];
      const editableBlockDomRect = editableBlock.getClientRects()[0];
      const blockDocDomRect = blockContentsEl?.getClientRects()[0];
      if (blockDocDomRect && frameHtml && topBarHeight) {
        const frameDomRect = frameHtml.getClientRects()[0];
        const padding = window
          .getComputedStyle(editableBlock, null)
          .getPropertyValue("padding-right");
        const paddingValue = Number(padding.replace("px", ""));
        const innerWidth = window.innerWidth;
        /**
         * 뷰포트를 기준으로 한 comment의 y좌표
         */
        const y = blockDocDomRect.bottom;
        const onBottom: CSSProperties = {
          top: y - topBarHeight + frameHtml.scrollTop,
          maxHeight: window.innerHeight - y - EXTRA_SPACE,
        };
        const remainsWhenOnTop =
          window.innerHeight - topBarHeight - blockDocDomRect.top;
        const maxHeightWhenOnTop =
          remainsWhenOnTop > MAX_HEIGHT_OF_COMMENTS
            ? remainsWhenOnTop
            : MAX_HEIGHT_OF_COMMENTS;
        const onTop: CSSProperties = {
          top:
            blockDocDomRect.top -
            topBarHeight +
            frameHtml.scrollTop -
            maxHeightWhenOnTop,
          maxHeight: maxHeightWhenOnTop,
        };
        const overHeight = y + MAX_HEIGHT_OF_COMMENTS >= window.innerHeight;

        const left =
          innerWidth > 768
            ? editableBlockDomRect.x - frameDomRect.x
            : innerWidth * 0.1;
        const width =
          innerWidth > 768
            ? editableBlock.clientWidth - paddingValue
            : innerWidth * 0.8;

        const targetStyle: CSSProperties = overHeight ? onTop : onBottom;
        const style: CSSProperties = {
          ...targetStyle,
          display: "flex",
          left: left,
          width: width,
        };

        setCommentsStyle(style);
      }
    }
  }, [block, frameHtml]);

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
    return () => {
      sessionStorage.removeItem(SESSION_KEY.editComment);
      sessionStorage.removeItem(SESSION_KEY.toolMoreItem);
      sessionStorage.removeItem(SESSION_KEY.mainCommentId);
    };
  }, []);

  return (
    <div className="comments" ref={commentsRef} style={commentsStyle}>
      {allComments && (
        <section className="comments__comments-group">
          {allComments.map((comment: MainCommentType) => (
            <Comment
              {...props}
              key={`comment_${comment.id}`}
              comment={comment}
              editBlock={editBlock}
              allComments={allComments}
              setAllComments={setAllComments}
              moreOpen={moreOpen}
              setMoreOpen={setMoreOpen}
              templateHtml={templateHtml}
              setToolMoreStyle={setToolMoreStyle}
              openDiscardEdit={openDiscardEdit}
              setOpenDiscardEdit={setOpenDiscardEdit}
            />
          ))}
        </section>
      )}
      {moreOpen && (
        <CommentToolMore
          toolMoreStyle={toolMoreStyle}
          page={props.page}
          pageId={props.pageId}
          blockId={block ? block.id : null}
          editBlock={editBlock}
          editPage={editPage}
          setAllComments={setAllComments}
          setMoreOpen={setMoreOpen}
          templateHtml={templateHtml}
        />
      )}
      {openDiscardEdit && (
        <DiscardEditModal
          openDiscardEdit={openDiscardEdit}
          setOpenDiscardEdit={setOpenDiscardEdit}
          discardEdit={discardEdit}
        />
      )}
    </div>
  );
};

export default React.memo(Comments);
