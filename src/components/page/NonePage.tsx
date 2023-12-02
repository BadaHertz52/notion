import React from "react";

import { Page } from "../../types";
import { getPageSample } from "../../utils";

type NoPageProps = {
  addPage: (newPage: Page) => void;
};

const NonePage = ({ addPage }: NoPageProps) => {
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
