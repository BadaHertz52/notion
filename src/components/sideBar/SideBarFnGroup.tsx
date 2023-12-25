import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFillTrash2Fill } from "react-icons/bs";
import { HiTemplate } from "react-icons/hi";

type SideBarFnGroupProp = {
  openQuickFindBoard: () => void;
  onClickTrashBtn: () => void;
  openTemplates: () => void;
};
function SideBarFnGroup({ ...props }: SideBarFnGroupProp) {
  return (
    <div className="side-bar__fn-group">
      <button
        id="btn-open-quickFindBoard"
        title="button to open quick find board"
        onClick={props.openQuickFindBoard}
      >
        <div className="item__inner">
          <BiSearchAlt2 />
          <span>Quick Find</span>
        </div>
      </button>
      <button
        className="btn-open-templates"
        title="button to open templates"
        onClick={props.openTemplates}
      >
        <div className="item__inner">
          <HiTemplate />
          <span>Templates</span>
        </div>
      </button>
      <button
        title="button to open form that has deleted pages"
        onClick={props.onClickTrashBtn}
        className="btn-trash"
      >
        <div className="item__inner">
          <BsFillTrash2Fill />
          <span>Trash</span>
        </div>
      </button>
    </div>
  );
}

export default React.memo(SideBarFnGroup);
