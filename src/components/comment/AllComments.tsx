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

import { ScreenOnly } from "../index";
import AllCommentsContents, {
  AllCommentsContentsProps,
} from "./AllCommentsContents";

import "../../assets/allComments.scss";

type AllCommentsProps = Omit<AllCommentsContentsProps, "select"> & {
  setShowAllComments: Dispatch<SetStateAction<boolean>>;
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

  const [select, setSelect] = useState<"open" | "resolve">("open");

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

  const changeStyle = useCallback(() => {
    if (showAllComments) {
      allCommentsRef.current?.classList.remove("hide");
      setTimeout(() => {
        allCommentsRef.current?.classList.add("on");
      }, 50);
    } else {
      const classList = allCommentsRef.current?.classList;
      classList?.contains("on") &&
        allCommentsRef.current?.classList.remove("on");
      !classList?.contains("hide") &&
        setTimeout(() => {
          allCommentsRef.current?.classList.add("hide");
        }, 2500);
    }
  }, [showAllComments, allCommentsRef]);

  useEffect(() => {
    inner?.addEventListener("click", closeAllComments);
    return () => {
      inner?.removeEventListener("click", closeAllComments);
    };
  }, [inner, closeAllComments]);

  useEffect(() => {
    changeStyle();
    window.addEventListener("resize", changeStyle);
    return () => window.removeEventListener("resize", changeStyle);
  }, [changeStyle]);

  return (
    <div id="allComments" className="allComments hide" ref={allCommentsRef}>
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
              {select === "open" ? "Open" : "Resolve"}
              <MdKeyboardArrowDown />
            </button>
            <div className="type-btn-group">
              <button
                title="open  not resolved comments"
                onClick={(event) => {
                  setSelect("open");
                  closeSelect(event);
                }}
              >
                Open Comments
              </button>
              <button
                title="open resolved comments"
                onClick={(event) => {
                  setSelect("resolve");
                  closeSelect(event);
                }}
              >
                Resolved Comments
              </button>
            </div>
          </div>
        </div>
        {showAllComments && (
          <AllCommentsContents
            page={page}
            userName={userName}
            select={select}
            discardEdit={discardEdit}
            setDiscardEdit={setDiscardEdit}
            showAllComments={showAllComments}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(AllComments);
