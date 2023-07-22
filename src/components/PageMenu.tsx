import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { ActionContext } from "../containers/NotionRouter";
import { Block, ListItem, Page } from "../modules/notion/type";
import { setTemplateItem } from "../fn";
import ScreenOnly from "./ScreenOnly";
import PageButton from "./PageButton";

type PageMenuProps = {
  what: "page" | "block";
  currentPage: Page;
  pages: Page[];
  firstList: ListItem[];
  closeMenu?: () => void;
  setTargetPageId: Dispatch<SetStateAction<string>>;
};

const PageMenu = ({
  what,
  currentPage,
  pages,
  firstList,
  closeMenu,
  setTargetPageId,
}: PageMenuProps) => {
  const { changeBlockToPage } = useContext(ActionContext).actions;

  const [search, setSearch] = useState<boolean>(false);
  const [result, setResult] = useState<ListItem[] | null>(null);
  const [block, setBlock] = useState<Block | null>(null);
  const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;

  const templateHtml = document.getElementById("template");

  const findResult = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(true);
    const value = event.target.value;
    const filteredPages: Page[] = pages.filter((page: Page) =>
      page.header.title?.includes(value)
    );
    const RESULT: listItem[] = filteredPages.map((page: Page) => ({
      id: page.id,
      title: page.header.title,
      iconType: page.header.iconType,
      icon: page.header.icon,
      subPagesId: page.subPagesId,
      parentsId: page.parentsId,
      editTime: JSON.stringify(Date.now()),
      createTime: JSON.stringify(Date.now()),
    }));
    setResult(RESULT);
  };
  const makeNewSubPage = () => {
    if (block) {
      setTemplateItem(templateHtml, currentPage);
      changeBlockToPage(currentPage.id, block);
    }
  };
  useEffect(() => {
    if (sessionItem && what === "block") {
      const block: Block = JSON.parse(sessionItem);
      setBlock(block);
    }
  }, [sessionItem, what]);
  return (
    <div id="pageMenu">
      <div className="inner">
        <div className="search">
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
        {search ? (
          result ? (
            <div className="page-group">
              {result.map((item: ListItem) => (
                <PageButton
                  key={`list_${item.id}`}
                  pages={pages}
                  currentPage={currentPage}
                  closeMenu={closeMenu}
                  what={what}
                  block={block}
                  setTargetPageId={setTargetPageId}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="page-group no-result">No result</div>
          )
        ) : (
          <>
            <div className="page-group">
              <header className="page-group__header">Suggested</header>
              {firstList.map((item: ListItem) => (
                <PageButton
                  key={`list_${item.id}`}
                  pages={pages}
                  currentPage={currentPage}
                  closeMenu={closeMenu}
                  what={what}
                  block={block}
                  setTargetPageId={setTargetPageId}
                  item={item}
                />
              ))}
            </div>
            <button
              id="new_sub_page"
              title="button to add new subpage"
              onClick={makeNewSubPage}
            >
              <AiOutlinePlus />
              <span>New sub-page</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(PageMenu);
