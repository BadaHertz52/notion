import React, {
  ChangeEvent,
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";

import { CSSProperties } from "styled-components";
import { AiOutlinePlus } from "react-icons/ai";

import { ActionContext } from "../../contexts";
import { Block, ListItem, Page } from "../../types";
import { getEditTime, isMobile, setTemplateItem } from "../../utils";
import { ScreenOnly, PageBtnList } from "../index";
import { SESSION_KEY } from "../../constants";

type PageMenuProps = {
  what: "page" | "block";
  currentPage: Page;
  pages: Page[];
  firstList: ListItem[];
  closeMenu?: () => void;
  setPageMenuStyle?: Dispatch<SetStateAction<CSSProperties | undefined>>;
};

const PageMenu = ({
  what,
  currentPage,
  pages,
  firstList,
  closeMenu,
  setPageMenuStyle,
}: PageMenuProps) => {
  const { changeBlockToPage } = useContext(ActionContext).actions;
  const pageMenuRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState<boolean>(false);
  const [result, setResult] = useState<ListItem[] | null>(null);
  const [block, setBlock] = useState<Block | null>(null);
  const listMargin = 16;
  const [listWidth, setListWidth] = useState<number>(320 - listMargin * 2);
  const sessionItem = sessionStorage.getItem(
    SESSION_KEY.blockFnTarget
  ) as string;

  const templateHtml = document.getElementById("template");

  const findResult = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(true);
      const editTime = getEditTime();
      const value = event.target.value;
      const filteredPages: Page[] = pages.filter((page: Page) =>
        page.header.title?.includes(value)
      );
      const RESULT: ListItem[] = filteredPages.map((page: Page) => ({
        id: page.id,
        title: page.header.title,
        iconType: page.header.iconType,
        icon: page.header.icon,
        subPagesId: page.subPagesId,
        parentsId: page.parentsId,
        editTime: editTime,
        createTime: editTime,
      }));
      setResult(RESULT);
    },
    [pages]
  );
  const handleClose = () => {
    if (closeMenu) {
      if (isMobile() && setPageMenuStyle) {
        setPageMenuStyle({
          top: "100vh",
        });
        setTimeout(() => {
          closeMenu();
        }, 1000);
      } else {
        closeMenu();
      }
    } else {
      return undefined;
    }
  };
  const makeNewSubPage = useCallback(() => {
    if (block) {
      setTemplateItem(templateHtml, currentPage);
      changeBlockToPage(currentPage.id, block);
    }
  }, [block, changeBlockToPage, currentPage, templateHtml]);

  const handleTouchMove = (event: React.TouchEvent) => {
    const currentTarget = event.currentTarget as HTMLElement | null;
    if (currentTarget) {
      currentTarget.classList.toggle("on");
    }
  };
  useEffect(() => {
    if (sessionItem && what === "block") {
      const block: Block = JSON.parse(sessionItem);
      setBlock(block);
    }
  }, [sessionItem, what]);
  useEffect(() => {
    if (pageMenuRef.current) {
      setListWidth(pageMenuRef.current.clientWidth - listMargin * 2);
    }
  }, [pageMenuRef]);
  return (
    <div id="pageMenu" ref={pageMenuRef}>
      <div className="inner">
        {isMobile() && (
          <div className="pageMenu__btn-container">
            <button
              className="pageMenu__btn-close"
              onClick={handleClose}
              onTouchMove={handleTouchMove}
            >
              close
            </button>
          </div>
        )}
        <div
          className="search"
          style={{ width: listWidth, marginLeft: "auto", marginRight: "auto" }}
        >
          <label>
            <ScreenOnly text="input in pageMenu to search page" />
            <input
              id="pageMenu__search__input"
              title="input in pageMenu to search page"
              type="search"
              onChange={findResult}
            />
          </label>
        </div>
        <div
          className="page-list"
          style={{ width: listWidth, marginLeft: "auto", marginRight: "auto" }}
        >
          {search ? (
            result ? (
              <PageBtnList
                list={result}
                listWidth={listWidth}
                pages={pages}
                currentPage={currentPage}
                closeMenu={handleClose}
                what={what}
                block={block}
              />
            ) : (
              <div className="no-result">no result</div>
            )
          ) : (
            <>
              <header className="page-list__header">Suggested</header>
              <PageBtnList
                list={firstList}
                listWidth={listWidth}
                pages={pages}
                currentPage={currentPage}
                closeMenu={handleClose}
                what={what}
                block={block}
              />
            </>
          )}
        </div>
        {!search && (
          <button
            id="new_sub_page"
            className="new_sub_page"
            title="button to add new subpage"
            onClick={makeNewSubPage}
            onTouchMove={handleTouchMove}
          >
            <AiOutlinePlus />
            <span>New sub-page</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(PageMenu);
