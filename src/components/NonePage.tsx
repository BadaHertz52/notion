import React from "react";
import { pageSample } from "../modules/notion/reducer";
import { Page } from "../modules/notion/type";
import NotionHelmet from "./NotionHelmet";
type NoPageProps = {
  addPage: (newPage: Page) => void;
};
const NonePage = ({ addPage }: NoPageProps) => {
  return (
    <>
      <NotionHelmet />
      <div className="editor nonePage">
        <p>Page doesn't existence</p>
        <p>Try make new Page</p>
        <button
          title="button to make new page"
          onClick={() => addPage(pageSample)}
        >
          Make new page
        </button>
      </div>
    </>
  );
};

export default React.memo(NonePage);
