import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from "react";
import { IoTrashOutline } from "react-icons/io5";
import { RiArrowGoBackLine } from "react-icons/ri";
import { CSSProperties } from "styled-components";
import { ActionContext } from "../containers/NotionRouter";
import { Page } from "../modules/notion/type";
import Result, { resultType } from "./Result";
import { makeResultType } from "../fn";
import ScreenOnly from "./ScreenOnly";
type ResultItemProps = {
  item: resultType;
  setTargetPageId: Dispatch<SetStateAction<string>>;
  setOpenTrash: Dispatch<React.SetStateAction<boolean>>;
};
type TrashProps = {
  style: CSSProperties | undefined;
  trashPagesId: string[] | null;
  trashPages: Page[] | null;
  pagesId: string[] | null;
  setTargetPageId: Dispatch<SetStateAction<string>>;
  setOpenTrash: Dispatch<React.SetStateAction<boolean>>;
};
const ResultItem = ({
  item,
  setTargetPageId,
  setOpenTrash,
}: ResultItemProps) => {
  const { cleanTrash, restorePage } = useContext(ActionContext).actions;
  const goPage = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    setOpenTrash(false);
    if (!["button", "svg", "path"].includes(tagName)) {
      setTargetPageId(item.id);
    }
  };

  return (
    <div className="page" onClick={goPage}>
      <Result item={item} />
      <div className="btn-group">
        <button
          title="button to restore page"
          className="btn-restore"
          onClick={() => restorePage(item.id)}
        >
          <ScreenOnly text="button to restore page" />
          <RiArrowGoBackLine />
        </button>
        <button
          title="button to  permanently delete page"
          className="btn-clean"
          onClick={() => cleanTrash(item.id)}
        >
          <ScreenOnly text="button to permanently delete page" />
          <IoTrashOutline />
        </button>
      </div>
    </div>
  );
};

const Trash = ({
  style,
  trashPages,
  trashPagesId,
  pagesId,
  setTargetPageId,
  setOpenTrash,
}: TrashProps) => {
  const [trashList, setTrashList] = useState<resultType[] | undefined>(
    undefined
  );
  //undefined 이면 trash가 없는것
  const [result, setResult] = useState<resultType[] | null>(null);
  //null 이면 검색의 결과값이 없는것
  const [sort, setSort] = useState<"all" | "current">("all");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (trashList) {
      const value = event.target.value.toLowerCase();
      const resultList = trashList.filter((item: resultType) =>
        item.title.toLowerCase().includes(value)
      );
      resultList?.[0] ? setResult(resultList) : setResult(null);
    }
  };

  useEffect(() => {
    if (pagesId) {
      let filteringTargetList: resultType[] | undefined = undefined;
      const makeFilteringTargetList = (
        pages: Page[] | null
      ): resultType[] | undefined =>
        pages?.map((page: Page) =>
          makeResultType(page, pagesId, pages, trashPagesId, trashPages)
        );

      switch (sort) {
        case "all":
          filteringTargetList = makeFilteringTargetList(trashPages);
          break;
        case "current":
          const location = window.location;
          const path = location.hash;
          const lastSlash = path.lastIndexOf("/");
          const currentPageId = path.slice(lastSlash + 1);
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
  }, [sort, pagesId, trashPages, trashPagesId]);

  return (
    <div id="trash" style={style}>
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
              result.map((item: resultType) => (
                <ResultItem
                  item={item}
                  setTargetPageId={setTargetPageId}
                  setOpenTrash={setOpenTrash}
                />
              ))
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
