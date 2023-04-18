import React, {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  TouchEvent,
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

export const closePopup = (
  elementId: string,
  setState: Dispatch<SetStateAction<boolean>>,
  event: globalThis.MouseEvent
) => {
  const eventTarget = event.target as Element | null;
  if (eventTarget?.id !== "imageIconInput") {
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

type ItemTemplageProp = {
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
}: ItemTemplageProp) => {
  const [toggleStyle, setToggleStyle] = useState<CSSProperties>({
    transform: "rotate(0deg)",
  });
  const sideBarPageFn = useRef<HTMLDivElement>(null);
  const onToggleSubPage = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const toggleSubPage = (subPageElement: null | undefined | Element) => {
      if (subPageElement !== null && subPageElement !== undefined) {
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
    if (sideBarPageFn.current !== null) {
      sideBarPageFn.current.classList.toggle("on");
    }
  };
  const removeOn = () => {
    if (sideBarPageFn.current !== null) {
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
      className="itemInner pageLink"
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
            sideBarPageFn.current !== null &&
              onClickMoreBtn(item, sideBarPageFn.current);
          }}
        >
          <BsThreeDots />
        </button>
        <button
          className="addPageBtn"
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
  onClickMoreBtn,
  addNewSubPage,
  changeSide,
}: ListTemplateProp) => {
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
    const listItemArray: listItem[] = ids.map((id: string) =>
      findSubPage(id, pagesId, pages)
    );
    return listItemArray;
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
          {notion.pages !== null &&
            notion.pagesId !== null &&
            (item.subPagesId !== null ? (
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
  addBlock,
  editBlock,
  deleteBlock,
  changeBlockToPage,
  addPage,
  duplicatePage,
  editPage,
  deletePage,
  movePageToPage,
  cleanTrash,
  restorePage,
  addFavorites,
  removeFavorites,
  changeSide,
  setTargetPageId,
  openQF,
  setOpenQF,
  setOpenTemplates,
  showAllComments,
}: SideBarProps) => {
  const inner = document.getElementById("inner");
  const pages = notion.pages;
  const pagesId = notion.pagesId;
  const recentPages =
    pages !== null && pagesId !== null && user.recentPagesId !== null
      ? user.recentPagesId.map(
          (pageId: string) => findPage(pagesId, pages, pageId) as Page
        )
      : null;
  const trashPages = notion.trash.pages;
  const trashPagesId = notion.trash.pagesId;
  const firstPagesId = notion.firstPagesId;
  const firstPages =
    pagesId !== null && pages !== null && firstPagesId !== null
      ? firstPagesId.map((id: string) => findPage(pagesId, pages, id))
      : null;
  const firstList: listItem[] | null =
    firstPages !== null
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
    const list: listItem[] | null =
      favorites !== null
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
  const list: listItem[] | null =
    firstPages !== null
      ? firstPages
          .filter((page: Page) => page.parentsId == null)
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
    if (pagesId !== null && pages !== null) {
      const targetPage = findPage(pagesId, pages, item.id);
      const newPageBlock: Block = {
        ...blockSample,
        contents: "untitle",
        type: "page",
        parentBlocksId: null,
      };
      if (targetPage.blocksId == null) {
        addBlock(targetPage.id, newPageBlock, 0, null);
      } else {
        addBlock(
          targetPage.id,
          newPageBlock,
          targetPage.blocksId.length,
          targetPage.firstBlocksId == null
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
        closePopup("moreFn", setOpenSideMoreMenu, event);
        setMoreFnStyle(undefined);
      }
    }
    openPageMenu && closePopup("pageMenu", setOpenPageMenu, event);
    openRename && closePopup("rename", setOpenRename, event);

    openTrash && closePopup("trash", setOpenTrash, event);
  });

  const onClickToDelete = () => {
    setOpenSideMoreMenu(false);
    if (targetItem !== null) {
      deletePage(targetItem.id);
    }
  };
  const onClickMoveToBtn = () => {
    setOpenPageMenu(true);
    setOpenSideMoreMenu(false);
    if (window.innerWidth > 768) {
      if (moreFnStyle !== undefined) {
        setPageMenuStyle({
          position: "absolute",
          top: moreFnStyle.top,
          left: moreFnStyle.left,
        });
      }
    } else {
    }
  };
  const onClickToAddFavorite = () => {
    setOpenSideMoreMenu(false);
    targetItem !== null && addFavorites(targetItem.id);
  };
  const onClickToRemoveFavorite = () => {
    setOpenSideMoreMenu(false);
    targetItem !== null && removeFavorites(targetItem.id);
  };
  const onClickToDuplicate = () => {
    setOpenSideMoreMenu(false);
    targetItem !== null && duplicatePage(targetItem.id);
  };
  const onClickToRename = () => {
    setOpenSideMoreMenu(false);
    setOpenRename(true);
    if (
      targetItem !== null &&
      target !== null &&
      target?.parentElement !== null
    ) {
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
    if (innerWidth > 768) {
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
    if (targetItem !== null && pagesId !== null && pages !== null) {
      const page = findPage(pagesId, pages, targetItem.id);
      setTargetPage(page);
    }
  }, [targetItem, pages, pagesId]);

  useEffect(() => {
    if (!openTrash) {
      const innerWidth = window.innerWidth;
      innerWidth > 768
        ? setTrashStyle({ display: "none" })
        : setTrashStyle(undefined);
    }
  }, [openTrash]);
  useEffect(() => {
    if (sideAppear === "close") {
      setOpenTrash(false);
    }
  }, [sideAppear]);
  return (
    <div className="sideBarOutBox" onMouseLeave={onMouseOutSideBar}>
      <div className="sideBar">
        <div className="sideBar_inner">
          <div className="sideBar_inner_top">
            <div className="switcher">
              <div className="itemInner">
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
                  className="closeSideBarBtn sideBarBtn"
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
                {recentPages == null ? (
                  <div>No pages visited recently </div>
                ) : (
                  recentPages.map((page: Page) => (
                    <button
                      id={`item_${page.id}`}
                      className="item"
                      onClick={() => onClickRecentPageItem(page.id)}
                    >
                      {page.header.cover !== null ? (
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
                <div className="itemInner">
                  <BiSearchAlt2 />
                  <span>Quick Find</span>
                </div>
              </button>
              <div>
                <div className="itemInner">
                  <AiOutlineClockCircle />
                  <span>All Updates</span>
                </div>
              </div>
              <div>
                <div className="itemInner">
                  <IoIosSettings />
                  <span>Setting &amp; Members</span>
                </div>
              </div>
            </div>
            <div className="srcoller">
              <div className="favorites">
                <div className="header">
                  <span>FAVORITES </span>
                </div>
                {user.favorites !== null &&
                  pagesId !== null &&
                  pages !== null && (
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
                    className="addPageBtn"
                    title="Quickly add a page inside"
                    onClick={addNewPage}
                  >
                    <AiOutlinePlus />
                  </button>
                </div>
                {notion.pages !== null && (
                  <div className="list">
                    {notion.pages[0] !== undefined && (
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
                <div className="itemInner">
                  <HiTemplate />
                  <span>Templates</span>
                </div>
              </button>
              <button onClick={onClickTrashBtn} ref={trashBtn}>
                <div className="itemInner">
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
        {targetItem !== null && (
          <div className="pageInform">
            <PageIcon
              icon={targetItem.icon}
              iconType={targetItem.iconType}
              style={undefined}
            />
            <div className="pageTitle">{targetItem.title}</div>
          </div>
        )}
        <button className="moreFn_fn deleteBtn" onClick={onClickToDelete}>
          <div>
            <RiDeleteBin6Line />
            <span>Delete</span>
          </div>
        </button>
        {targetItem !== null && user.favorites?.includes(targetItem.id) ? (
          <button className="moreFn_fn" onClick={onClickToRemoveFavorite}>
            <div>
              <AiOutlineStar />
              <span>Remove to Favorites</span>
            </div>
          </button>
        ) : (
          <button className="moreFn_fn" onClick={onClickToAddFavorite}>
            <div>
              <AiOutlineStar />
              <span>Add to Favorites</span>
            </div>
          </button>
        )}
        <button className="moreFn_fn" onClick={onClickToDuplicate}>
          <div>
            <HiOutlineDuplicate />
            <span>Duplicate</span>
            <span></span>
          </div>
        </button>
        <button className="moreFn_fn" onClick={onClickToRename}>
          <div>
            <BsPencilSquare />
            <span>Rename</span>
          </div>
        </button>
        <button className="moreFn_fn" onClick={onClickMoveToBtn}>
          <div>
            <IoArrowRedoOutline />
            <span>Move to</span>
          </div>
        </button>
        <div className="edit_inform">
          <p>Last edited by {user.userName}</p>
          {targetItem !== null && <Time editTime={targetItem.editTime} />}
        </div>
      </div>

      {openPageMenu &&
        targetItem !== null &&
        firstList !== null &&
        pages !== null &&
        pagesId !== null && (
          <div id="sideBar_pageMenu" style={pageMenuStyle}>
            <PageMenu
              what="page"
              currentPage={findPage(pagesId, pages, targetItem.id)}
              pages={pages}
              firstList={firstList}
              addBlock={addBlock}
              deleteBlock={deleteBlock}
              changeBlockToPage={changeBlockToPage}
              movePageToPage={movePageToPage}
              setOpenMenu={setOpenSideMoreMenu}
              setTargetPageId={setTargetPageId}
            />
          </div>
        )}
      {openRename && targetPage !== null && (
        <Rename
          currentPageId={null}
          block={null}
          page={targetPage}
          editBlock={editBlock}
          editPage={editPage}
          renameStyle={renameStyle}
          setOpenRename={setOpenRename}
        />
      )}
      <Trash
        style={trashStyle}
        trashPagesId={trashPagesId}
        trashPages={trashPages}
        pagesId={pagesId}
        cleanTrash={cleanTrash}
        restorePage={restorePage}
        setTargetPageId={setTargetPageId}
        setOpenTrash={setOpenTrash}
      />
    </div>
  );
};

export default React.memo(SideBar);
