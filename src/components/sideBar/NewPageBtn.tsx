import React from "react";

import { AiOutlinePlus } from "react-icons/ai";

type NewPageBtnProp = {
  addNewPage: () => void;
};

const NewPageBtn = ({ ...props }: NewPageBtnProp) => {
  return (
    <div className="addNewPageBtn">
      <button title="make new page" onClick={props.addNewPage}>
        <AiOutlinePlus />
        <span>New page</span>
      </button>
    </div>
  );
};

export default React.memo(NewPageBtn);
