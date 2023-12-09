import React, {
  Dispatch,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";

import { AiOutlineCheck } from "react-icons/ai";
import { BsChevronDown, BsSearch } from "react-icons/bs";

import { ScreenOnly, ResultList } from "../index";

import { Page, QuickFindBoardOption, ResultType } from "../../types";
import { findPage, makeResultType } from "../../utils";

import "../../assets/quickFindBoard.scss";
import { OPTION } from "../../constants";
import QuickFindBoardOptionBtn from "./QuickFindBoardOptionBtn";

type QuickFindBoardProps = {
  userName: string;
  recentPagesId: string[] | null;
  pages: Page[];
  pagesId: string[];
  cleanRecentPage: () => void;
};

const QuickFindBoard = ({
  userName,
  recentPagesId,
  pages,
  pagesId,
  cleanRecentPage,
}: QuickFindBoardProps) => {
  const resultBodyRef = useRef<HTMLDivElement>(null);

  const ITEM_SIZE = 16 * 1.1 + 16;
  const LIST_WIDTH: number = resultBodyRef.current?.clientWidth || 300 - 10 * 2;
  const LIST_HEIGHT = ITEM_SIZE * 4;

  const [selectedOption, setSelectedOption] =
    useState<QuickFindBoardOption>("bestMatches");
  const [search, setSearch] = useState<boolean>(false);
  const [result, setResult] = useState<ResultType[] | undefined>();
  const [bestMatchesResult, setBestMatchesResult] = useState<
    ResultType[] | undefined
  >();
  const sortOptions = useRef<HTMLDivElement>(null);
  const openSortOptionsBtn = useRef<HTMLButtonElement>(null);
  const recentPagesList = recentPagesId?.map((id: string) => {
    const page = findPage(pagesId, pages, id);
    return makeResultType(page, pagesId, pages, null, null);
  });

  const onChangeQuickFindInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.toLowerCase();
      if (!value) {
        setResult(undefined);
        setSearch(false);
      } else {
        setSearch(true);
        const resultPage = pages.filter((page: Page) =>
          page.header.title.toLowerCase().includes(value)
        );

        if (!resultPage[0]) {
          setResult(undefined);
        } else {
          const listItems: ResultType[] = resultPage.map((page: Page) =>
            makeResultType(page, pagesId, pages, null, null)
          );
          setResult(listItems);
          setBestMatchesResult(listItems);
        }
      }
    },
    [pages, pagesId]
  );

  const openSortOptions = useCallback(() => {
    if (sortOptions.current) {
      sortOptions.current.classList.toggle("on");
      const qf_results = document.getElementsByClassName("qf__results")[0];
      sortOptions.current.classList.contains("on")
        ? qf_results.setAttribute("style", "min-height:170px")
        : qf_results.setAttribute("style", "min-height:min-content");
    }
  }, []);

  return (
    <div id="quickFindBoard">
      <div className="inner" id="quickFindBoard__inner">
        <div>
          <div className="qf__search">
            <BsSearch />
            <label>
              <ScreenOnly text="search input in quick find board to search page" />
              <input
                id="qf__search__input"
                type="text"
                title="search input in quick find board to search page"
                onChange={onChangeQuickFindInput}
                placeholder={`Search ${userName}'s Notion`}
              />
            </label>
          </div>
          <div className="qf__results">
            <div className="header">
              {result ? (
                <div className="sort">
                  <div className="sort__inner">
                    <div>Sort :</div>
                    <button
                      title="button to open box to select option"
                      onClick={openSortOptions}
                      ref={openSortOptionsBtn}
                    >
                      <div>{selectedOption}</div>
                      <BsChevronDown />
                    </button>
                    <div className="sort__options" ref={sortOptions}>
                      {Object.keys(OPTION).map((v) => (
                        <QuickFindBoardOptionBtn
                          option={v as QuickFindBoardOption}
                          selectedOption={selectedOption}
                          setSelectedOption={setSelectedOption}
                          search={search}
                          result={result}
                          bestMatchesResult={bestMatchesResult}
                          setResult={setResult}
                          openSortOptions={openSortOptions}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p>RECENT PAGES</p>
                  <button
                    title="button to clear option"
                    className="btn-clear"
                    onClick={cleanRecentPage}
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
            <div className="body" ref={resultBodyRef}>
              {search &&
                (result ? (
                  <ResultList
                    list={result}
                    listWidth={LIST_WIDTH}
                    listHeight={LIST_HEIGHT}
                    layout="vertical"
                    itemSize={ITEM_SIZE}
                  />
                ) : (
                  <div className="no-result">
                    <p>No result</p>
                    <p>Some results may be in your deleted pages</p>
                    <p>Search deleted pages</p>
                  </div>
                ))}
              {!search &&
                (recentPagesList ? (
                  <ResultList
                    list={recentPagesList}
                    listWidth={LIST_WIDTH}
                    listHeight={LIST_HEIGHT}
                    layout="vertical"
                    itemSize={ITEM_SIZE}
                  />
                ) : (
                  <div className="noRecentPages">
                    There are no pages visited recently.
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(QuickFindBoard);
