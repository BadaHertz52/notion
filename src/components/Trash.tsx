import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import { CSSProperties } from "styled-components";

import { Page } from "../modules/notion/type";
import { resultType } from "./Result";
import { getCurrentPageId, makeResultType } from "../fn";
import ScreenOnly from "./ScreenOnly";
import TrashResultItem from "./TrashResultItem";
import ResultList from "./ResultList";

type TrashProps = {
  style: CSSProperties | undefined;
  trashPagesId: string[] | null;
  trashPages: Page[] | null;
  pagesId: string[] | null;
  pages: Page[] | null;
  openTrash: boolean;
  setOpenTrash: Dispatch<SetStateAction<boolean>>;
};

const Trash = ({
  style,
  trashPages,
  trashPagesId,
  pagesId,
  pages,
  openTrash,
  setOpenTrash,
}: TrashProps) => {
  const trashRef = useRef<HTMLDivElement>(null);
  const [trashList, setTrashList] = useState<resultType[] | undefined>(
    undefined
  );
  //undefined 이면 trash가 없는것
  const [result, setResult] = useState<resultType[] | null>(null);
  //null 이면 검색의 결과값이 없는것
  const [sort, setSort] = useState<"all" | "current">("all");
  //const itemSize =
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (trashList) {
        const value = event.target.value.toLowerCase();
        const resultList = trashList.filter((item: resultType) =>
          item.title.toLowerCase().includes(value)
        );
        resultList?.[0] ? setResult(resultList) : setResult(null);
      }
    },
    [trashList]
  );

  useEffect(() => {
    if (pagesId && pages) {
      let filteringTargetList: resultType[] | undefined = undefined;
      const makeFilteringTargetList = (
        targetPages: Page[] | null
      ): resultType[] | undefined =>
        targetPages?.map((page: Page) =>
          makeResultType(page, pagesId, pages, trashPagesId, trashPages)
        );

      switch (sort) {
        case "all":
          filteringTargetList = makeFilteringTargetList(trashPages);
          break;
        case "current":
          const currentPageId = getCurrentPageId();
          const filteredTrashPages = trashPages?.filter((page: Page) =>
            page.parentsId?.includes(currentPageId)
          );
          filteringTargetList = filteredTrashPages
            ? filteredTrashPages[0]
              ? makeFilteringTargetList(filteredTrashPages)
              : undefined
            : undefined;
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

  useEffect(() => {
    const classList = trashRef.current?.classList;
    const isMobile = window.innerWidth <= 768;
    if (openTrash) {
      trashRef.current?.classList.remove("hide");
      if (isMobile) {
        setTimeout(() => {
          trashRef.current?.classList.add("on");
        }, 100);
      } else {
        trashRef.current?.classList.add("on");
      }
    } else {
      // add hide  from classList
      if (!classList?.contains("hide")) {
        if (isMobile) {
          setTimeout(() => {
            trashRef.current?.classList.add("hide");
          }, 800);
        } else {
          trashRef.current?.classList.add("hide");
        }
      }
      //remove on to classList
      classList?.contains("on") && trashRef.current?.classList.remove("on");
    }
  }, [openTrash]);
  return (
    <div id="trash" className="trash hide" style={style} ref={trashRef}>
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
            onClick={() => setOpenTrash(false)}
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
                listWidth={300}
                listHeight={40 * 3}
                layout="vertical"
                itemSize={40}
              />
            ) : (
              <div className="no-result">No matches found.</div>
            )
          ) : (
            <div className="noTrash">Empty</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Trash);
