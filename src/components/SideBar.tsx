import React, {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  TouchEvent,
  useContext,
} from "react";
import {
  Block,
  blockSample,
  findPage,
  listItem,
  Notion,
  Page,
  pageSample,
} from "../modules/notion";
import { detectRange } from "./BlockFn";
import { UserState } from "../modules/user";
import Trash from "./Trash";
import Rename from "./Rename";
import Time from "./Time";
import PageMenu from "./PageMenu";
import PageIcon from "./PageIcon";
import { SideBarContainerProp } from "../containers/SideBarContainer";
import { SideAppear } from "../modules/side";

//react-icon
import { FiCode, FiChevronsLeft } from "react-icons/fi";
import {
  AiOutlineClockCircle,
  AiOutlinePlus,
  AiOutlineStar,
} from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import {
  BsFillTrash2Fill,
  BsPencilSquare,
  BsThreeDots,
  BsTrash,
} from "react-icons/bs";
import { IoIosSettings } from "react-icons/io";
import { HiOutlineDuplicate, HiTemplate } from "react-icons/hi";
import { MdPlayArrow } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoArrowRedoOutline } from "react-icons/io5";
import { ActionContext } from "../containers/NotionRouter";

export const closeModal = (
  elementId: string,
  setState: Dispatch<SetStateAction<boolean>>,
  event: globalThis.MouseEvent
) => {
  const eventTarget = event.target as Element | null;
  if (eventTarget?.id !== "inputImgIcon") {
    const element = document.getElementById(elementId);
    const elementDomRect = element?.getClientRects()[0];
    const isInElement = detectRange(event, elementDomRect);
    !isInElement && setState(false);
  }
};

type SideBarProps = SideBarContainerProp & {
  notion: Notion;
  user: UserState;
};

type ItemTemplateProp = {
  item: listItem;
  setTargetPageId: Dispatch<SetStateAction<string>>;
  onClickMoreBtn: (item: listItem, target: HTMLElement) => void;
  addNewSubPage: (item: listItem) => void;
  changeSide: (appear: SideAppear) => void;
};
type ListTemplateProp = {
  notion: Notion;
  targetList: listItem[] | null;
  setTargetPageId: Dispatch<SetStateAction<string>>;
  onClickMoreBtn: (item: listItem, target: HTMLElement) => void;
  addNewSubPage: (item: listItem) => void;
  changeSide: (appear: SideAppear) => void;
};
const ItemTemplate = ({
  item,
  setTargetPageId,
  onClickMoreBtn,
  addNewSubPage,
  changeSide,
}: ItemTemplateProp) => {
  const [toggleStyle, setToggleStyle] = useState<CSSProperties>({
    transform: "rotate(0deg)",
  });
  const sideBarPageFn = useRef<HTMLDivElement>(null);
  const onToggleSubPage = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const toggleSubPage = (subPageElement: null | undefined | Element) => {
      if (subPageElement) {
        subPageElement.classList.toggle("on");
        subPageElement.classList.contains("on")
          ? setToggleStyle({
              transform: "rotate(90deg)",
            })
          : setToggleStyle({
              transform: "rotate(0deg)",
            });
      }
    };
    switch (target.tagName.toLocaleLowerCase()) {
      case "path":
        let subPageElement =
          target.parentElement?.parentElement?.parentElement?.parentElement
            ?.parentElement?.nextElementSibling;
        toggleSubPage(subPageElement);
        break;
      case "svg":
        subPageElement =
          target.parentElement?.parentElement?.parentElement?.parentElement
            ?.nextElementSibling;
        toggleSubPage(subPageElement);
        break;
      case "button":
        subPageElement =
          target.parentElement?.parentElement?.parentElement
            ?.nextElementSibling;
        toggleSubPage(subPageElement);
        break;

      default:
        break;
    }
  };
  const showPageFn = () => {
    if (sideBarPageFn.current) {
      sideBarPageFn.current.classList.toggle("on");
    }
  };
  const removeOn = () => {
    if (sideBarPageFn.current) {
      sideBarPageFn.current.classList.contains("on") &&
        sideBarPageFn.current.classList.remove("on");
    }
  };
  const onClickPageName = () => {
    setTargetPageId(item.id);
    if (window.innerWidth <= 768) {
      changeSide("close");
    }
  };
  return (
    <div
      className="item__inner page-link"
      onMouseOver={showPageFn}
      onMouseOut={removeOn}
    >
      <div className="pageItem">
        <button
          className="toggleBtn"
          onClick={onToggleSubPage}
          style={toggleStyle}
        >
          <MdPlayArrow />
        </button>
        <button className="pageName" onClick={onClickPageName}>
          <PageIcon
            icon={item.icon}
            iconType={item.iconType}
            style={undefined}
          />
          <div>{item.title}</div>
        </button>
      </div>
      <div className="sideBarPageFn" ref={sideBarPageFn}>
        <button
          className="moreBtn"
          title="delete, duplicate, and more"
          onClick={() => {
            sideBarPageFn.current &&
              onClickMoreBtn(item, sideBarPageFn.current);
          }}
        >
          <BsThreeDots />
        </button>
        <button
          className="btn-addPage"
          title="Quickly add a page inside"
          onClick={() => {
            addNewSubPage(item);
          }}
        >
          <AiOutlinePlus />
        </button>
      </div>
    </div>
  );
};

const ListTemplate = ({
  notion,
  targetList,
  setTargetPageId,
  addNewSubPage,
  onClickMoreBtn,
}: ListTemplateProp) => {
  const { changeSide } = useContext(ActionContext).actions;
  const findSubPage = (
    id: string,
    pagesId: string[],
    pages: Page[]
  ): listItem => {
    const index = pagesId.indexOf(id);
    const subPage: Page = pages[index];
    return {
      id: subPage.id,
      title: subPage.header.title,
      iconType: subPage.header.iconType,
      icon: subPage.header.icon,
      subPagesId: subPage.subPagesId,
      parentsId: subPage.parentsId,
      editTime: subPage.editTime,
      createTime: subPage.createTime,
    };
  };
  const makeTargetList = (
    ids: string[],
    pagesId: string[],
    pages: Page[]
  ): listItem[] => {
    const listItemArr: listItem[] = ids.map((id: string) =>
      findSubPage(id, pagesId, pages)
    );
    return listItemArr;
  };
  return (
    <ul>
      {targetList?.map((item: listItem) => (
        <li id={`item_${item.id}`} key={item.id}>
          <div className="mainPage">
            <ItemTemplate
              item={item}
              setTargetPageId={setTargetPageId}
              onClickMoreBtn={onClickMoreBtn}
              addNewSubPage={addNewSubPage}
              changeSide={changeSide}
            />
          </div>
          {notion.pages &&
            notion.pagesId &&
            (item.subPagesId ? (
              <div className="subPage">
                <ListTemplate
                  notion={notion}
                  targetList={makeTargetList(
                    item.subPagesId,
                    notion.pagesId,
                    notion.pages
                  )}
                  setTargetPageId={setTargetPageId}
                  onClickMoreBtn={onClickMoreBtn}
                  addNewSubPage={addNewSubPage}
                  changeSide={changeSide}
                />
              </div>
            ) : (
              <div className="subPage no">
                <span>No page inside</span>
              </div>
            ))}
        </li>
      ))}
    </ul>
  );
};

const SideBar = ({
  notion,
  user,
  sideAppear,
  setTargetPageId,
  setOpenQF,
  setOpenTemplates,
  showAllComments,
}: SideBarProps) => {
  const {
    addBlock,
    addPage,
    duplicatePage,
    deletePage,
    addFavorites,
    removeFavorites,
    changeSide,
  } = useContext(ActionContext).actions;
  const inner = document.getElementById("inner");
  const pages = notion.pages;
  const pagesId = notion.pagesId;
  const recentPages =
    pages && pagesId && user.recentPagesId
      ? user.recentPagesId.map(
          (pageId: string) => findPage(pagesId, pages, pageId) as Page
        )
      : null;
  const trashPages = notion.trash.pages;
  const trashPagesId = notion.trash.pagesId;
  const firstPagesId = notion.firstPagesId;
  const firstPages =
    pagesId && pages && firstPagesId
      ? firstPagesId.map((id: string) => findPage(pagesId, pages, id))
      : null;
  const firstList: listItem[] | null = firstPages
    ? firstPages.map((page: Page) => {
        return {
          id: page.id,
          title: page.header.title,
          iconType: page.header.iconType,
          icon: page.header.icon,
          subPagesId: page.subPagesId,
          parentsId: page.parentsId,
          editTime: page.editTime,
          createTime: page.createTime,
        };
      })
    : null;
  const trashBtn = useRef<HTMLButtonElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [targetItem, setTargetItem] = useState<listItem | null>(null);
  const [targetPage, setTargetPage] = useState<Page | null>(null);
  const [openTrash, setOpenTrash] = useState<boolean>(false);
  const [openSideMoreMenu, setOpenSideMoreMenu] = useState<boolean>(false);
  const [openPageMenu, setOpenPageMenu] = useState<boolean>(false);
  const [openRename, setOpenRename] = useState<boolean>(false);
  const [trashStyle, setTrashStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [moreFnStyle, setMoreFnStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [renameStyle, setRenameStyle] = useState<CSSProperties>();
  const [pageMenuStyle, setPageMenuStyle] = useState<CSSProperties>();

  const recordIcon = user.userName.substring(0, 1);
  const touchResizeBar = useRef<boolean>(false);
  const makeFavoriteList = (
    favorites: string[] | null,
    pagesId: string[],
    pages: Page[]
  ): listItem[] | null => {
    const list: listItem[] | null = favorites
      ? favorites.map((id: string) => {
          const page = findPage(pagesId, pages, id);
          const listItem = {
            id: page.id,
            title: page.header.title,
            iconType: page.header.iconType,
            icon: page.header.icon,
            subPagesId: page.subPagesId,
            parentsId: page.parentsId,
            editTime: page.editTime,
            createTime: page.createTime,
          };
          return listItem;
        })
      : null;
    return list;
  };
  const list: listItem[] | null = firstPages
    ? firstPages
        .filter((page: Page) => page.parentsId === null)
        .map((page: Page) => ({
          id: page.id,
          iconType: page.header.iconType,
          icon: page.header.icon,
          title: page.header.title,
          subPagesId: page.subPagesId,
          parentsId: page.parentsId,
          editTime: page.editTime,
          createTime: page.createTime,
        }))
    : null;
  const addNewPage = () => {
    addPage(pageSample);
  };

  const addNewSubPage = (item: listItem) => {
    if (pagesId && pages) {
      const targetPage = findPage(pagesId, pages, item.id);
      const newPageBlock: Block = {
        ...blockSample,
        contents: "untitle",
        type: "page",
        parentBlocksId: null,
      };
      if (targetPage.blocksId === null) {
        addBlock(targetPage.id, newPageBlock, 0, null);
      } else {
        addBlock(
          targetPage.id,
          newPageBlock,
          targetPage.blocksId.length,
          targetPage.firstBlocksId === null
            ? null
            : targetPage.firstBlocksId[targetPage.firstBlocksId.length - 1]
        );
      }
    }
  };

  const onClickMoreBtn = (item: listItem, target: HTMLElement) => {
    setOpenSideMoreMenu(true);
    setTargetItem(item);
    setTarget(target);
    if (window.innerWidth > 768) {
      const position = target.getClientRects()[0];
      setMoreFnStyle({
        display: "block",
        position: "absolute",
        top: position.top,
        left: position.right,
      });
    } else {
      setMoreFnStyle({
        display: "block",
        transform: "translateY(50vh)",
      });
    }
  };

  inner?.addEventListener("click", (event) => {
    if (openSideMoreMenu) {
      const target = event.target as HTMLElement | null;
      if (target?.parentElement?.className !== "resizeBar") {
        closeModal("moreFn", setOpenSideMoreMenu, event);
        setMoreFnStyle(undefined);
      }
    }
    openPageMenu && closeModal("pageMenu", setOpenPageMenu, event);
    openRename && closeModal("rename", setOpenRename, event);

    openTrash && closeModal("trash", setOpenTrash, event);
  });

  const onClickToDelete = () => {
    setOpenSideMoreMenu(false);
    if (targetItem) {
      deletePage(targetItem.id);
    }
  };
  const onClickMoveToBtn = () => {
    setOpenPageMenu(true);
    setOpenSideMoreMenu(false);
    if (window.innerWidth > 768) {
      setPageMenuStyle({
        position: "absolute",
        top: "50%",
        left: "50%",
      });
    }
  };
  const onClickToAddFavorite = () => {
    setOpenSideMoreMenu(false);
    targetItem && addFavorites(targetItem.id);
  };
  const onClickToRemoveFavorite = () => {
    setOpenSideMoreMenu(false);
    targetItem && removeFavorites(targetItem.id);
  };
  const onClickToDuplicate = () => {
    setOpenSideMoreMenu(false);
    targetItem && duplicatePage(targetItem.id);
  };
  const onClickToRename = () => {
    setOpenSideMoreMenu(false);
    setOpenRename(true);
    if (targetItem && target && target?.parentElement) {
      const domRect = target.parentElement.getClientRects()[0];
      setRenameStyle({
        position: "absolute",
        top: domRect.bottom,
        left: domRect.left + 10,
      });
    }
  };
  const changeTrashStyle = () => {
    const innerWidth = window.innerWidth;
    if (innerWidth >= 768) {
      if (trashBtn.current) {
        const domRect = trashBtn.current.getClientRects()[0];
        setTrashStyle({
          display: "flex",
          position: "absolute",
          top: domRect.top - 100,
          left:
            window.innerWidth >= 768
              ? domRect.right + 50
              : window.innerWidth * 0.2,
        });
      }
    } else {
      setTrashStyle({
        display: "block",
        transform: "translateY(0)",
      });
    }
  };

  window.onresize = () => {
    if (window.innerWidth < 800 && sideAppear === "lock" && showAllComments) {
      changeSide("close");
    }
    openTrash && changeTrashStyle();
  };
  const onClickTrashBtn = (event: React.MouseEvent) => {
    setOpenTrash(true);
    changeTrashStyle();
  };
  const onMouseOutSideBar = () => {
    sideAppear === "float" && changeSide("floatHide");
  };
  const onClickRecentPageItem = (pageId: string) => {
    setTargetPageId(pageId);
    changeSide("close");
  };
  const onTouchStartResizeBar = (event: TouchEvent<HTMLElement>) => {
    touchResizeBar.current = true;
  };
  const onTouchMoveSideBar = (event: TouchEvent<HTMLDivElement>) => {
    if (touchResizeBar.current) {
      const clientY = event.changedTouches[0].clientY;
      const innerHeight = window.innerHeight;
      if (innerHeight - 50 <= clientY) {
        setMoreFnStyle(undefined);
        touchResizeBar.current = false;
      } else {
        setMoreFnStyle({
          display: "block",
          transform: `translateY(${clientY}px)`,
        });
      }
    }
  };
  useEffect(() => {
    if (targetItem && pagesId && pages) {
      const page = findPage(pagesId, pages, targetItem.id);
      setTargetPage(page);
    }
  }, [targetItem, pages, pagesId]);

  useEffect(() => {
    if (!openTrash) {
      const innerWidth = window.innerWidth;
      innerWidth > 768
        ? setTrashStyle({ display: "none" })
        : setTrashStyle({
            transform: "translateY(105vh)",
          });
    }
  }, [openTrash]);
  useEffect(() => {
    if (sideAppear === "close") {
      setOpenTrash(false);
    }
  }, [sideAppear]);
  return (
    <div className="sideBar-outbox" onMouseLeave={onMouseOutSideBar}>
      <div className="sideBar">
        <div className="sideBar__inner">
          <div className="sideBar__inner_top">
            <div className="switcher">
              <div className="item__inner">
                <div>
                  <div className="record-icon">
                    <div>{recordIcon}</div>
                  </div>
                  <div className="user">
                    <div className="userId">
                      <div>{user.userName}'s Notion</div>
                      <div>
                        <FiCode />
                      </div>
                    </div>
                    <div className="userEmail">
                      <div>{user.userEmail}</div>
                    </div>
                  </div>
                </div>
                <button
                  className="closeSideBarBtn topBar__btn-sideBar"
                  onClick={() => changeSide("close")}
                >
                  <FiChevronsLeft />
                </button>
                <button
                  className="trashBtn"
                  onClick={onClickTrashBtn}
                  ref={trashBtn}
                >
                  <BsTrash />
                </button>
              </div>
            </div>
            <div className="recentPages">
              <div className="header">
                <span>RECENTLY VISITED PAGE </span>
              </div>
              <div className="list">
                {recentPages === null ? (
                  <div>No pages visited recently </div>
                ) : (
                  recentPages.map((page: Page, i) => (
                    <button
                      key={`recentPage_${i}`}
                      id={`item_${page.id}`}
                      className="item"
                      onClick={() => onClickRecentPageItem(page.id)}
                    >
                      {page.header.cover ? (
                        <img
                          className="cover"
                          src={page.header.cover}
                          alt="pageCover"
                        />
                      ) : (
                        <div className="cover none"></div>
                      )}
                      <PageIcon
                        icon={page.header.icon}
                        iconType={page.header.iconType}
                        style={undefined}
                      />
                      <div className="title">{page.header.title}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className="fun1">
              <button onClick={() => setOpenQF(true)}>
                <div className="item__inner">
                  <BiSearchAlt2 />
                  <span>Quick Find</span>
                </div>
              </button>
              <div>
                <div className="item__inner">
                  <AiOutlineClockCircle />
                  <span>All Updates</span>
                </div>
              </div>
              <div>
                <div className="item__inner">
                  <IoIosSettings />
                  <span>Setting &amp; Members</span>
                </div>
              </div>
            </div>
            <div className="sideBar__inner__scroll">
              <div className="favorites">
                <div className="header">
                  <span>FAVORITES </span>
                </div>
                {user.favorites && pagesId && pages && (
                  <div className="list">
                    <ListTemplate
                      notion={notion}
                      targetList={makeFavoriteList(
                        user.favorites,
                        pagesId,
                        pages
                      )}
                      setTargetPageId={setTargetPageId}
                      onClickMoreBtn={onClickMoreBtn}
                      addNewSubPage={addNewSubPage}
                      changeSide={changeSide}
                    />
                  </div>
                )}
              </div>
              <div className="private">
                <div className="header">
                  <span>PRIVATE</span>
                  <button
                    className="btn-addPage"
                    title="Quickly add a page inside"
                    onClick={addNewPage}
                  >
                    <AiOutlinePlus />
                  </button>
                </div>
                {notion.pages && (
                  <div className="list">
                    {notion.pages[0] && (
                      <ListTemplate
                        notion={notion}
                        targetList={list}
                        setTargetPageId={setTargetPageId}
                        onClickMoreBtn={onClickMoreBtn}
                        addNewSubPage={addNewSubPage}
                        changeSide={changeSide}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="fun2">
              <button onClick={() => setOpenTemplates(true)}>
                <div className="item__inner">
                  <HiTemplate />
                  <span>Templates</span>
                </div>
              </button>
              <button onClick={onClickTrashBtn} ref={trashBtn}>
                <div className="item__inner">
                  <BsFillTrash2Fill />
                  <span>Trash</span>
                </div>
              </button>
            </div>
          </div>
          {/* <a href="https://icons8.com/icon/11732/페이지-개요">페이지 개요 icon by Icons8</a> */}
          <div className="addNewPageBtn">
            <button onClick={addNewPage}>
              <AiOutlinePlus />
              <span>New page</span>
            </button>
          </div>
        </div>
      </div>
      <div id="moreFn" style={moreFnStyle} onTouchMove={onTouchMoveSideBar}>
        <button className="resizeBar" onTouchStart={onTouchStartResizeBar}>
          <div></div>
        </button>
        {targetItem && (
          <div className="page__inform">
            <PageIcon
              icon={targetItem.icon}
              iconType={targetItem.iconType}
              style={undefined}
            />
            <div className="page__title">{targetItem.title}</div>
          </div>
        )}
        <button className="moreFn__btn btn-delete" onClick={onClickToDelete}>
          <div>
            <RiDeleteBin6Line />
            <span>Delete</span>
          </div>
        </button>
        {targetItem && user.favorites?.includes(targetItem.id) ? (
          <button className="moreFn__btn" onClick={onClickToRemoveFavorite}>
            <div>
              <AiOutlineStar />
              <span>Remove to Favorites</span>
            </div>
          </button>
        ) : (
          <button className="moreFn__btn" onClick={onClickToAddFavorite}>
            <div>
              <AiOutlineStar />
              <span>Add to Favorites</span>
            </div>
          </button>
        )}
        <button className="moreFn__btn" onClick={onClickToDuplicate}>
          <div>
            <HiOutlineDuplicate />
            <span>Duplicate</span>
            <span></span>
          </div>
        </button>
        <button className="moreFn__btn" onClick={onClickToRename}>
          <div>
            <BsPencilSquare />
            <span>Rename</span>
          </div>
        </button>
        <button className="moreFn__btn" onClick={onClickMoveToBtn}>
          <div>
            <IoArrowRedoOutline />
            <span>Move to</span>
          </div>
        </button>
        <div className="edit__inform">
          <p>Last edited by {user.userName}</p>
          {targetItem && <Time editTime={targetItem.editTime} />}
        </div>
      </div>

      {openPageMenu && targetItem && firstList && pages && pagesId && (
        <div id="sideBar__pageMenu" style={pageMenuStyle}>
          <PageMenu
            what="page"
            currentPage={findPage(pagesId, pages, targetItem.id)}
            pages={pages}
            firstList={firstList}
            closeMenu={() => setOpenSideMoreMenu(false)}
            setTargetPageId={setTargetPageId}
          />
        </div>
      )}
      {openRename && targetPage && (
        <Rename
          currentPageId={null}
          block={null}
          page={targetPage}
          renameStyle={renameStyle}
          setOpenRename={setOpenRename}
        />
      )}
      <Trash
        style={trashStyle}
        trashPagesId={trashPagesId}
        trashPages={trashPages}
        pagesId={pagesId}
        setTargetPageId={setTargetPageId}
        setOpenTrash={setOpenTrash}
      />
    </div>
  );
};

export default React.memo(SideBar);
