import React, {
  ChangeEvent,
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";

import { AiOutlinePlus } from "react-icons/ai";

import { ScreenOnly, PageBtnList } from "../index";
import { ActionContext } from "../../contexts";
import { Block, ListItem, Page } from "../../types";
import { getEditTime, isMobile, setOriginTemplateItem } from "../../utils";

export type PageMenuProps = {
  what: "page" | "block";
  block?: Block;
  currentPage: Page;
  pages: Page[];
  firstList: ListItem[];
  closeMenu?: () => void;
};

const PageMenu = ({
  what,
  block,
  currentPage,
  pages,
  firstList,
  closeMenu,
}: PageMenuProps) => {
  const { changeBlockToPage } = useContext(ActionContext).actions;

  const pageMenuRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState<boolean>(false);
  const [result, setResult] = useState<ListItem[] | null>(null);
  const listMargin = 16;
  const [listWidth, setListWidth] = useState<number>(320 - listMargin * 2);

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
      if (isMobile()) {
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
      setOriginTemplateItem(currentPage);
      changeBlockToPage(currentPage.id, block);
    }
  }, [block, changeBlockToPage, currentPage]);

  const handleTouchMove = (event: React.TouchEvent) => {
    const currentTarget = event.currentTarget as HTMLElement | null;
    if (currentTarget) {
      currentTarget.classList.toggle("on");
    }
  };

  useEffect(() => {
    if (pageMenuRef.current) {
      setListWidth(pageMenuRef.current.clientWidth - listMargin * 2);
    }
  }, [pageMenuRef]);

  return (
    <div id="page-meu" ref={pageMenuRef}>
      <div className="inner">
        <div
          className="search"
          style={{ width: listWidth, marginLeft: "auto", marginRight: "auto" }}
        >
          <label>
            <ScreenOnly text="input in pageMenu to search page" />
            <input
              id="pageMenu__search__input"
              title="input in pageMenu to search page"
              placeholder="search page"
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
