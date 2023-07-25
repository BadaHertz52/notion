import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Block, MainCommentType, Page } from "../modules/notion/type";
import Comments from "./Comments";
import ScreenOnly from "./ScreenOnly";

type AllCommentsProps = {
  page: Page;
  userName: string;
  favorites: string[] | null;
  showAllComments: boolean;
  setShowAllComments: Dispatch<SetStateAction<boolean>>;
  discardEdit: boolean;
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
};
const AllComments = ({
  page,
  userName,
  showAllComments,
  setShowAllComments,
  discardEdit,
  setDiscardEdit,
}: AllCommentsProps) => {
  const inner = document.getElementById("inner");
  const allCommentsRef = useRef<HTMLDivElement>(null);
  const closeAllComments = useCallback(
    (event: globalThis.MouseEvent) => {
      if (showAllComments) {
        const target = event.target as HTMLElement | null;
        const isInAllComments = target?.closest("#allComments");
        const isInAllCommentsBtn = target?.closest("#allCommentsBtn");
        if (!isInAllComments && !isInAllCommentsBtn) {
          setShowAllComments(false);
        }
      }
    },
    [setShowAllComments, showAllComments]
  );

  const pageId = page.id;
  const commentsBlocks: Block[] | null = page.blocks
    ? page.blocks.filter((block: Block) => block.comments && block.comments)
    : null;
  const targetCommentsBlocks: Block[] | null =
    commentsBlocks === null ? null : commentsBlocks[0] ? commentsBlocks : null;
  const allComments = targetCommentsBlocks?.map(
    (block: Block) => block.comments
  );
  const open = "open";
  const resolve = "resolve";
  const [select, setSelect] = useState<typeof open | typeof resolve>(open);
  const [result, setResult] = useState<boolean>(true);
  const openSelect = (event: MouseEvent) => {
    const target = event.currentTarget;
    const typesDoc = target.parentElement;
    typesDoc?.classList.toggle("open");
  };
  const closeSelect = (event: MouseEvent) => {
    const target = event.currentTarget.parentElement?.previousElementSibling;
    if (target) {
      target.parentElement?.classList.remove("open");
    }
  };
  useEffect(() => {
    if (allComments) {
      let resultComments: MainCommentType[] = [];
      allComments.forEach((comments: MainCommentType[] | null) => {
        if (comments) {
          const selectedComments = comments.filter(
            (c: MainCommentType) => c.type === select
          );
          selectedComments[0] &&
            selectedComments.forEach((c) => resultComments.push(c));
        }
      });
      if (resultComments[0] === undefined) {
        setResult(false);
      } else {
        setResult(true);
      }
    }
  }, [select, allComments]);
  useEffect(() => {
    inner?.addEventListener("click", closeAllComments);
    return () => {
      inner?.removeEventListener("click", closeAllComments);
    };
  }, [inner, closeAllComments]);
  const changeStyle = useCallback(() => {
    const editorEl = document.getElementsByClassName("editor")[0];
    const isMobile = editorEl.clientWidth < 1024;
    if (showAllComments) {
      allCommentsRef.current?.classList.add("on");
      isMobile &&
        setTimeout(() => {
          allCommentsRef.current?.classList.add("mobile");
        }, 100);
    } else {
      if (isMobile) {
        allCommentsRef.current?.classList.remove("mobile");
        setTimeout(() => {
          allCommentsRef.current?.classList.remove("mobile");
        }, 2500);
      } else {
        allCommentsRef.current?.classList.remove("on");
      }
    }
  }, [showAllComments, allCommentsRef]);

  useEffect(() => {
    changeStyle();
    window.addEventListener("resize", changeStyle);
    return () => window.removeEventListener("resize", changeStyle);
  }, [changeStyle]);
  return (
    <div id="allComments" className="allComments" ref={allCommentsRef}>
      <div className="allComments__inner">
        <div className="allComments__header">
          <div>Comments</div>
          <div className="allComments__btn-group">
            <button
              className="btn-select"
              onClick={openSelect}
              type="button"
              title="select open  not resolved comments or resolved comments"
            >
              <ScreenOnly text="select open  not resolved comments or resolved comments" />
              {select === open ? "Open" : "Resolve"}
              <MdKeyboardArrowDown />
            </button>
            <div className="type-btn-group">
              <button
                title="open  not resolved comments"
                onClick={(event) => {
                  setSelect(open);
                  closeSelect(event);
                }}
              >
                Open Comments
              </button>
              <button
                title="open resolved comments"
                onClick={(event) => {
                  setSelect(resolve);
                  closeSelect(event);
                }}
              >
                Resolved Comments
              </button>
            </div>
          </div>
        </div>
        {targetCommentsBlocks === null || !result ? (
          <div className="no-result">
            <div>
              <p>No {select === open ? "Open" : "Resolved"} comments yet</p>
              <p>
                {select === open ? "Open" : "Resolved"} comments on this page
                will appear here
              </p>
            </div>
            {/*icon*/}
          </div>
        ) : (
          targetCommentsBlocks.map((block: Block) => (
            <Comments
              key={`allComments_${block.id}`}
              pageId={pageId}
              page={page}
              userName={userName}
              block={block}
              frameHtml={null}
              openComment={false}
              select={select}
              discardEdit={discardEdit}
              setDiscardEdit={setDiscardEdit}
              showAllComments={showAllComments}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(AllComments);
