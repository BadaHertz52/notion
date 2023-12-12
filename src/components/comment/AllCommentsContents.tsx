import React, {
  useState,
  useCallback,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import Comments from "./Comments";
import { Block, MainCommentType, Page } from "../../types";

export type AllCommentsContentsProps = {
  page: Page;
  userName: string;
  select: "open" | "resolve";
  discardEdit: boolean;
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
  showAllComments: boolean;
};
function AllCommentsContents({
  page,
  userName,
  select,
  discardEdit,
  setDiscardEdit,
  showAllComments,
}: AllCommentsContentsProps) {
  type ResultItem = {
    mainComments: MainCommentType[];
    block: Block;
  };
  const [result, setResult] = useState<ResultItem[] | null>(null);

  const getResult = useCallback((): ResultItem[] | null => {
    let result: ResultItem[] | null = null;
    const commentsBlocks = page.blocks?.filter(
      (block: Block) => block.comments
    );

    commentsBlocks?.forEach((block: Block) => {
      const targetComments = (block.comments as MainCommentType[]).filter(
        (comment: MainCommentType) => comment.type === select
      );

      if (targetComments[0]) {
        const newItem: ResultItem = {
          block: block,
          mainComments: targetComments,
        };
        result ? result.push(newItem) : (result = [newItem]);
      }
    });
    return result;
  }, [page.blocks, select]);

  useEffect(() => {
    console.log("select", select);
    const newResult = getResult();
    setResult(newResult);
  }, [select, getResult]);
  return (
    <div className="allComments__contents">
      {!result ? (
        <div className="no-result">
          <div>
            <p>No {select === "open" ? "Open" : "Resolved"} comments yet</p>
            <p>
              {select === "open" ? "Open" : "Resolved"} comments on this page
              will appear here
            </p>
          </div>
        </div>
      ) : (
        result.map((item: ResultItem) => (
          <Comments
            key={`allComments_${item.block.id}`}
            targetMainComments={item.mainComments}
            pageId={page.id}
            page={page}
            userName={userName}
            block={item.block}
            frameHtml={null}
            showAllComments={showAllComments}
          />
        ))
      )}
    </div>
  );
}

export default AllCommentsContents;
