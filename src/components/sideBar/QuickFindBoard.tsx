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

import { Page, ResultType } from "../../types";
import { findPage, makeResultType } from "../../utils";

import "../../assets/quickFindBoard.scss";

type QuickFindBoardProps = {
  userName: string;
  recentPagesId: string[] | null;
  pages: Page[];
  pagesId: string[];
  cleanRecentPage: () => void;
  setOpenQF: Dispatch<React.SetStateAction<boolean>>;
};

const QuickFindBoard = ({
  userName,
  recentPagesId,
  pages,
  pagesId,
  cleanRecentPage,
  setOpenQF,
}: QuickFindBoardProps) => {
  const inner = document.getElementById("notion__inner");
  const bestMatches = "Best matches";
  const lastEditedNewest = "Last edited:Newest first";
  const lastEditedOldest = "Last edited:Oldest first";
  const createdNewest = "Created:Newest first";
  const createdOldest = "Created:Oldest first";
  const resultBodyRef = useRef<HTMLDivElement>(null);
  const listWidth: number = resultBodyRef.current?.clientWidth || 300 - 10 * 2;
  const [selectedOption, setSelectedOption] = useState<string>(bestMatches);
  const [result, setResult] = useState<ResultType[] | null | "noResult">(null);
  const [bestMatchesResult, setBestMatchesResult] = useState<
    ResultType[] | null | "noResult"
  >(null);
  const itemSize = 16 * 1.1 + 16;
  const listHeight = itemSize * 4;
  const sortOptions = useRef<HTMLDivElement>(null);
  const openSortOptionsBtn = useRef<HTMLButtonElement>(null);
  const recentPagesList = recentPagesId?.map((id: string) => {
    const page = findPage(pagesId, pages, id);
    return makeResultType(page, pagesId, pages, null, null);
  });

  const onChangeQuickFindInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.toLowerCase();
      if (value === "") {
        setResult(null);
      } else {
        const resultPage = pages.filter((page: Page) =>
          page.header.title.toLowerCase().includes(value)
        );

        if (resultPage[0] === undefined) {
          setResult("noResult");
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
  const onClickOption = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      const selected = document
        .getElementById("quickFindBoard")
        ?.getElementsByClassName("selected")[0];
      if (selected) {
        selected?.classList.remove("selected");
      }
      const target = event.target as HTMLElement;
      let option: string = "";
      switch (target.tagName.toLowerCase()) {
        case "button":
          option = target.firstChild?.textContent as string;
          target.classList.add("selected");
          break;
        case "div":
          target.parentElement?.classList.add("selected");
          if (target.className === "optionName") {
            option = target.textContent as string;
          } else {
            option = target.previousElementSibling?.textContent as string;
          }
          break;
        case "svg":
          option = target.parentElement?.previousElementSibling
            ?.textContent as string;
          target.parentElement?.parentElement?.classList.add("selected");
          break;
        case "path":
          option = target.parentElement?.parentElement?.previousElementSibling
            ?.textContent as string;
          target.parentElement?.parentElement?.parentElement?.classList.add(
            "selected"
          );
          break;
        default:
          break;
      }

      setSelectedOption(option);
      if (result && result !== "noResult") {
        if (bestMatchesResult && bestMatchesResult !== "noResult") {
          const compareResult = (
            a: ResultType,
            b: ResultType,
            what: "editTime" | "createTime",
            sort: "newest" | "oldest"
          ) => {
            const A =
              what === "createTime" ? Number(a.createTime) : Number(a.editTime);
            const B =
              what === "createTime" ? Number(b.createTime) : Number(b.editTime);
            let value: number = 0;
            switch (sort) {
              case "newest":
                value = B - A;
                break;
              case "oldest":
                value = A - B;
                break;
              default:
                break;
            }
            return value;
          };
          let sortedResult: ResultType[] | null = null;
          switch (option) {
            case bestMatches:
              setResult(bestMatchesResult);
              break;
            case lastEditedNewest:
              sortedResult = bestMatchesResult.sort((a, b) =>
                compareResult(a, b, "editTime", "newest")
              );
              break;
            case lastEditedOldest:
              sortedResult = bestMatchesResult.sort((a, b) =>
                compareResult(a, b, "editTime", "oldest")
              );
              break;
            case createdNewest:
              sortedResult = bestMatchesResult.sort((a, b) =>
                compareResult(a, b, "createTime", "newest")
              );
              break;
            case createdOldest:
              sortedResult = bestMatchesResult.sort((a, b) =>
                compareResult(a, b, "createTime", "oldest")
              );
              break;
            default:
              break;
          }
          setResult(sortedResult);
        } else {
          setResult(bestMatchesResult);
        }
      }
      openSortOptions();
    },
    [bestMatchesResult, openSortOptions, result]
  );
  /**
   * QuickFindBoard 에 click 이벤트가 일어날때, 해당 이벤트가 sortOptions에서 일어난 이벤트인지 확인하는 함수
   * @param event QuickFindBoard에서 발생한 click 이벤트
   * @returns click 이벤트가 sortOptions에서 발생했는지 여부
   */
  const checkOptionBtnClicked = useCallback((event: MouseEvent) => {
    const eventTarget = event.target as HTMLElement;
    let optionBtnIsClicked: boolean = false;
    const changeReturnValue = (condition: boolean) => {
      if (condition) {
        optionBtnIsClicked = true;
      } else {
        optionBtnIsClicked = false;
      }
    };
    switch (eventTarget.tagName) {
      case "SVG":
        const parentElement = eventTarget.parentElement as HTMLElement;
        changeReturnValue(parentElement.className === "checkIcon");
        break;
      case "DIV":
        changeReturnValue(eventTarget.className === "optionName");
        break;
      case "BUTTON":
        changeReturnValue(eventTarget.classList.contains("optionBtn"));
        break;
      default:
        break;
    }
    return optionBtnIsClicked;
  }, []);

  const closeQuickFindBoard = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const isInBoard = target?.closest("#quickFindBoard__inner");
      if (!isInBoard) {
        const optionBtnIsClicked = checkOptionBtnClicked(event);
        !optionBtnIsClicked && setOpenQF(false);
      }
    },
    [checkOptionBtnClicked, setOpenQF]
  );
  useEffect(() => {
    inner?.addEventListener("click", closeQuickFindBoard);
    return () => inner?.removeEventListener("click", closeQuickFindBoard);
  }, [inner, closeQuickFindBoard]);
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
                result !== "noResult" && (
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
                        <button
                          title={`button to select ${bestMatches}`}
                          onClick={onClickOption}
                          className="selected optionBtn"
                        >
                          <div className="optionName">{bestMatches}</div>
                          <div className="checkIcon">
                            <AiOutlineCheck />
                          </div>
                        </button>
                        <button
                          title={`button to select ${lastEditedNewest}`}
                          onClick={onClickOption}
                          className="optionBtn"
                        >
                          <div className="optionName">{lastEditedNewest}</div>
                          <div className="checkIcon">
                            <AiOutlineCheck />
                          </div>
                        </button>
                        <button
                          title={`button to select ${lastEditedOldest}`}
                          onClick={onClickOption}
                          className="optionBtn"
                        >
                          <div className="optionName">{lastEditedOldest}</div>

                          <div className="checkIcon">
                            <AiOutlineCheck />
                          </div>
                        </button>
                        <button
                          title={`button to select ${createdNewest}`}
                          onClick={onClickOption}
                          className="optionBtn"
                        >
                          <div className="optionName">{createdNewest}</div>
                          <div className="checkIcon">
                            <AiOutlineCheck />
                          </div>
                        </button>
                        <button
                          title={`button to select ${createdOldest}`}
                          onClick={onClickOption}
                          className="optionBtn"
                        >
                          <div className="optionName">{createdOldest}</div>
                          <div className="checkIcon">
                            <AiOutlineCheck />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )
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
              {result ? (
                result !== "noResult" ? (
                  <ResultList
                    list={result}
                    listWidth={listWidth}
                    listHeight={listHeight}
                    layout="vertical"
                    itemSize={itemSize}
                  />
                ) : (
                  <div className="no-result">
                    <p>No result</p>
                    <p>Some results may be in your deleted pages</p>
                    <p>Search deleted pages</p>
                  </div>
                )
              ) : recentPagesList ? (
                <ResultList
                  list={recentPagesList}
                  listWidth={listWidth}
                  listHeight={listHeight}
                  layout="vertical"
                  itemSize={itemSize}
                />
              ) : (
                <div className="noRecentPages">
                  There are no pages visited recently.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(QuickFindBoard);
