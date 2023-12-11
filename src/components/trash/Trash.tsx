import React, { useEffect, useState, useCallback, useRef } from "react";

import { ScreenOnly, ResultList } from "../index";

import { Page, ResultType } from "../../types";
import { getCurrentPageId, makeResultType } from "../../utils";

import "../../assets/trash.scss";

type TrashProps = {
  trashPagesId: string[] | null;
  trashPages: Page[] | null;
  pagesId: string[] | null;
  pages: Page[] | null;
  closeTrash: () => void;
};

const Trash = ({
  trashPages,
  trashPagesId,
  pagesId,
  pages,
  closeTrash,
}: TrashProps) => {
  const trashRef = useRef<HTMLDivElement>(null);
  const trashPadding = 12;
  const listWidth =
    (window.innerWidth > 768 ? 400 : window.innerWidth) - trashPadding * 2;
  const [trashList, setTrashList] = useState<ResultType[] | undefined>(
    undefined
  );
  //undefined 이면 trash가 없는것
  const [result, setResult] = useState<ResultType[] | null>(null);
  //null 이면 검색의 결과값이 없는것
  const [sort, setSort] = useState<"all" | "current">("all");
  //const itemSize =
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (trashList) {
        const value = event.target.value.toLowerCase();
        const resultList = trashList.filter((item: ResultType) =>
          item.title.toLowerCase().includes(value)
        );
        resultList?.[0] ? setResult(resultList) : setResult(null);
      }
    },
    [trashList]
  );

  useEffect(() => {
    if (pagesId && pages) {
      let filteringTargetList: ResultType[] | undefined = undefined;
      const makeFilteringTargetList = (
        targetPages: Page[] | null
      ): ResultType[] | undefined =>
        targetPages?.map((page: Page) =>
          makeResultType(page, pagesId, pages, trashPagesId, trashPages)
        );

      switch (sort) {
        case "all":
          filteringTargetList = makeFilteringTargetList(trashPages);
          break;
        case "current":
          const currentPageId = getCurrentPageId();
          if (currentPageId) {
            const filteredTrashPages = trashPages?.filter((page: Page) =>
              page.parentsId?.includes(currentPageId)
            );
            filteringTargetList = filteredTrashPages
              ? filteredTrashPages[0]
                ? makeFilteringTargetList(filteredTrashPages)
                : undefined
              : undefined;
          }
          break;
        default:
          break;
      }
      setTrashList(filteringTargetList);
      filteringTargetList && setResult(filteringTargetList);
    } else {
      setTrashList(undefined);
    }
  }, [sort, pagesId, pages, trashPages, trashPagesId]);

  return (
    <div id="trash" ref={trashRef}>
      <div className="inner">
        <div className="header">
          <div className="range">
            <button
              title="button to show all pages"
              onClick={() => setSort("all")}
            >
              All Pages
            </button>
            <button
              title="button to show  pages in current page"
              onClick={() => setSort("current")}
            >
              In current page
            </button>
          </div>
          <button
            title="close button"
            className="closeTrashBtn"
            onClick={closeTrash}
          >
            close
          </button>
        </div>
        <div className="search">
          <label>
            <ScreenOnly text="input to search page removed" />
            <input
              title="input to search page removed"
              type="text"
              onChange={onChange}
              placeholder="Filter by page title..."
            />
          </label>
        </div>
        <div className="trash__list">
          {trashList ? (
            result ? (
              <ResultList
                list={result}
                listWidth={listWidth}
                listHeight={50 * 3}
                layout="vertical"
                itemSize={40}
                isTrash={true}
                closeTrash={closeTrash}
              />
            ) : (
              <div className="no-result">No matches found.</div>
            )
          ) : (
            <div className="no-trash">Empty</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Trash);
