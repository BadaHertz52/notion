import React, {
  MouseEvent,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";

import { MdKeyboardArrowDown } from "react-icons/md";

import { ScreenOnly, AllCommentsContents } from "../index";
import { AllCommentsContentsProps } from "./AllCommentsContents";

import { isMobile } from "../../utils";
import { ModalType } from "../../types";

import "../../assets/allComments.scss";

export type AllCommentsProps = Omit<AllCommentsContentsProps, "select"> & {
  setModal: Dispatch<SetStateAction<ModalType>>;
};

const AllComments = ({ page, userName, setModal }: AllCommentsProps) => {
  const allCommentsRef = useRef<HTMLDivElement>(null);

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

  return (
    <div id="all-comments" className="all-comments" ref={allCommentsRef}>
      <div className="all-comments__inner">
        <div className="all-comments__header">
          <div>{!isMobile() && <div>Comments</div>}</div>
          <div className="all-comments__btn-group">
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
        <AllCommentsContents page={page} userName={userName} select={select} />
      </div>
    </div>
  );
};

export default React.memo(AllComments);
