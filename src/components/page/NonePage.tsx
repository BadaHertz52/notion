import React, { useContext } from "react";

import { getPageSample } from "../../utils";
import { ActionContext } from "../../contexts";

const NonePage = () => {
  const { addPage } = useContext(ActionContext).actions;
  return (
    <div className="editor nonePage">
      <p>Page doesn't existence</p>
      <p>Try make new Page</p>
      <button
        title="button to make new page"
        onClick={() => addPage(getPageSample())}
      >
        Make new page
      </button>
    </div>
  );
};

export default React.memo(NonePage);
