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
import { Block, listItem, Page } from "../modules/notion";
import { setTemplateItem } from "./BlockComponent";
import PageIcon from "./PageIcon";

type PageMenuProps = {
  what: "page" | "block";
  currentPage: Page;
  pages: Page[];
  firstList: listItem[];
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
  const { deleteBlock, changeBlockToPage, addBlock, movePageToPage } =
    useContext(ActionContext).actions;
  type PageButtonProps = {
    item: listItem;
  };
  const [search, setSearch] = useState<boolean>(false);
  const [result, setResult] = useState<listItem[] | null>(null);
  const [block, setBlock] = useState<Block | null>(null);
  const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;
  useEffect(() => {
    if (sessionItem && what === "block") {
      const block: Block = JSON.parse(sessionItem);
      setBlock(block);
    }
  }, [sessionItem, what]);
  const templateHtml = document.getElementById("template");

  const moveBlockToPage = (destinationPageId: string, block: Block) => {
    setTemplateItem(templateHtml, currentPage);
    // 기존 페이지에서 블록 삭제
    deleteBlock(currentPage.id, block, true);
    // 블록을 다른 페이지로 이동
    const newBlock: Block = {
      ...block,
      firstBlock: true,
      parentBlocksId: null,
      editTime: JSON.stringify(Date.now()),
    };
    const destinationPage = pages.filter(
      (page: Page) => page.id === destinationPageId
    )[0];
    //set origin destinationPage
    if (templateHtml) {
      const item = JSON.stringify(destinationPage);
      sessionStorage.setItem("originMoveTargetPage", item);
    }
    if (!destinationPage.blocksId) {
      addBlock(destinationPageId, newBlock, 0, null);
    } else {
      const blocksIdLength = destinationPage.blocksId.length;
      addBlock(destinationPageId, newBlock, blocksIdLength, null);
    }
    // close Menu and recovery Menu state
    closeMenu && closeMenu();
  };
  const onClickToMove = (id: string) => {
    switch (what) {
      case "block":
        if (block) {
          if (block.type === "page") {
            movePageToPage(block.id, id);
          } else {
            moveBlockToPage(id, block);
          }
        }
        break;
      case "page":
        movePageToPage(currentPage.id, id);
        setTargetPageId(id);
        break;
      default:
        break;
    }
  };

  const PageButton = ({ item }: PageButtonProps) => {
    return (
      <button className="btn-page" onClick={() => onClickToMove(item.id)}>
        <div className="btn-page__inner">
          <PageIcon
            icon={item.icon}
            iconType={item.iconType}
            style={undefined}
          />
          <div className="btn-page__title">
            <span>{item.title}</span>
          </div>
        </div>
      </button>
    );
  };
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
  return (
    <div id="pageMenu">
      <div className="inner">
        <div className="search">
          <input type="search" onChange={findResult} />
        </div>
        {search ? (
          result ? (
            <div className="page-group">
              {result.map((item: listItem) => (
                <PageButton key={`list_${item.id}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="page-group no-result">No result</div>
          )
        ) : (
          <>
            <div className="page-group">
              <header className="page-group__header">Suggested</header>
              {firstList.map((item: listItem) => (
                <PageButton key={`list_${item.id}`} item={item} />
              ))}
            </div>
            <button id="new_sub_page" onClick={makeNewSubPage}>
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
