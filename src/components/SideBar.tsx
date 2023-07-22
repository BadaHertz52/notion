import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  TouchEvent,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { blockSample, pageSample } from "../modules/notion/reducer";
import { Block, ListItem, Notion, Page } from "../modules/notion/type";
import { closeModal, findPage } from "../fn";
import { UserState } from "../modules/user/reducer";
import Trash from "./Trash";
import Rename from "./Rename";
import Time from "./Time";
import PageMenu from "./PageMenu";
import PageIcon from "./PageIcon";
import { SideBarContainerProp } from "../containers/SideBarContainer";

//react-icon
import { FiCode, FiChevronsLeft } from "react-icons/fi";
import {
  AiOutlineClockCircle,
  AiOutlinePlus,
  AiOutlineStar,
} from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFillTrash2Fill, BsPencilSquare, BsTrash } from "react-icons/bs";
import { IoIosSettings } from "react-icons/io";
import { HiOutlineDuplicate, HiTemplate } from "react-icons/hi";

import { RiDeleteBin6Line } from "react-icons/ri";
import { IoArrowRedoOutline } from "react-icons/io5";
import { ActionContext } from "../containers/NotionRouter";
import ScreenOnly from "./ScreenOnly";
import ListTemplate from "./ListTemplate";

type SideBarProps = SideBarContainerProp & {
  notion: Notion;
  user: UserState;
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
  const { pages, pagesId, trash, firstPagesId } = notion;
  const recentPages: Page[] | null = useMemo(
    () =>
      pages && pagesId && user.recentPagesId
        ? user.recentPagesId.map(
            (pageId: string) => findPage(pagesId, pages, pageId) as Page
          )
        : null,
    [pages, pagesId, user.recentPagesId]
  );

  const trashPages = trash.pages;
  const trashPagesId = trash.pagesId;
  const firstPages: Page[] | null = useMemo(
    () =>
      pagesId && pages && firstPagesId
        ? firstPagesId.map((id: string) => findPage(pagesId, pages, id) as Page)
        : null,
    [firstPagesId, pagesId, pages]
  );

  const firstList: ListItem[] | null = useMemo(
    () =>
      firstPages
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
        : null,
    [firstPages]
  );
  const trashBtn = useRef<HTMLButtonElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [targetItem, setTargetItem] = useState<ListItem | null>(null);
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
  const list: ListItem[] | null = useMemo(
    () =>
      firstPages
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
        : null,
    [firstPages]
  );

  const makeFavoriteList = useCallback(
    (
      favorites: string[] | null,
      pagesId: string[],
      pages: Page[]
    ): ListItem[] | null => {
      const list: ListItem[] | null = favorites
        ? favorites.map((id: string) => {
            const page = findPage(pagesId, pages, id);
            const ListItem = {
              id: page.id,
              title: page.header.title,
              iconType: page.header.iconType,
              icon: page.header.icon,
              subPagesId: page.subPagesId,
              parentsId: page.parentsId,
              editTime: page.editTime,
              createTime: page.createTime,
            };
            return ListItem;
          })
        : null;
      return list;
    },
    []
  );

  const addNewPage = () => {
    addPage(pageSample);
  };

  const addNewSubPage = useCallback(
    (item: ListItem) => {
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
    },
    [addBlock, pages, pagesId]
  );

  const onClickMoreBtn = useCallback((item: ListItem, target: HTMLElement) => {
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
  }, []);
  const handleClickToCloseModal = useCallback(
    (event: globalThis.MouseEvent) => {
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
    },
    [openPageMenu, openRename, openSideMoreMenu, openTrash]
  );

  const onClickToDelete = useCallback(() => {
    setOpenSideMoreMenu(false);
    if (targetItem) {
      deletePage(targetItem.id);
    }
  }, [deletePage, targetItem]);
  const onClickMoveToBtn = useCallback(() => {
    setOpenPageMenu(true);
    setOpenSideMoreMenu(false);
    if (window.innerWidth > 768) {
      setPageMenuStyle({
        position: "absolute",
        top: "50%",
        left: "50%",
      });
    }
  }, []);
  const onClickToAddFavorite = useCallback(() => {
    setOpenSideMoreMenu(false);
    targetItem && addFavorites(targetItem.id);
  }, [addFavorites, targetItem]);
  const onClickToRemoveFavorite = useCallback(() => {
    setOpenSideMoreMenu(false);
    targetItem && removeFavorites(targetItem.id);
  }, [targetItem, removeFavorites]);
  const onClickToDuplicate = useCallback(() => {
    setOpenSideMoreMenu(false);
    targetItem && duplicatePage(targetItem.id);
  }, [targetItem, duplicatePage]);
  const onClickToRename = useCallback(() => {
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
  }, [target, targetItem]);
  const changeTrashStyle = useCallback(() => {
    const innerWidth = window.innerWidth;
    if (innerWidth >= 768) {
      const domRect = trashBtn.current?.getClientRects()[0];
      if (domRect) {
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
  }, []);
  const handleResize = useCallback(() => {
    if (window.innerWidth < 800 && sideAppear === "lock" && showAllComments) {
      changeSide("close");
    }
    openTrash && changeTrashStyle();
  }, [changeSide, changeTrashStyle, openTrash, showAllComments, sideAppear]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.addEventListener("resize", handleResize);
  }, [handleResize]);

  const onClickTrashBtn = useCallback(
    (event: React.MouseEvent) => {
      setOpenTrash(true);
      changeTrashStyle();
    },
    [changeTrashStyle]
  );
  const onMouseOutSideBar = useCallback(() => {
    sideAppear === "float" && changeSide("floatHide");
  }, [changeSide, sideAppear]);
  const onClickRecentPageItem = useCallback(
    (pageId: string) => {
      setTargetPageId(pageId);
      changeSide("close");
    },
    [changeSide, setTargetPageId]
  );
  const onTouchStartResizeBar = useCallback(() => {
    touchResizeBar.current = true;
  }, []);
  const onTouchMoveSideBar = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
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
    },
    []
  );
  useEffect(() => {
    inner?.addEventListener("click", handleClickToCloseModal);

    return () => {
      inner?.removeEventListener("click", handleClickToCloseModal);
    };
  }, [inner, handleClickToCloseModal]);

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
                  title="button to close side menu"
                  className="closeSideBarBtn topBar__btn-sideBar"
                  onClick={() => changeSide("close")}
                >
                  <ScreenOnly text="button to close side menu" />
                  <FiChevronsLeft />
                </button>
                <button
                  title="button to open form that has deleted page"
                  className="trashBtn"
                  onClick={onClickTrashBtn}
                  ref={trashBtn}
                >
                  <ScreenOnly text="button to open form that has deleted page" />
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
                      title={`button to move page that is ${page.header.title}`}
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
              <button
                title="button to open quick find board"
                onClick={() => setOpenQF(true)}
              >
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
                    <ScreenOnly text="Quickly add a page inside" />
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
              <button
                title="button to open templates"
                onClick={() => setOpenTemplates(true)}
              >
                <div className="item__inner">
                  <HiTemplate />
                  <span>Templates</span>
                </div>
              </button>
              <button
                title="button to open form that has deleted pages"
                onClick={onClickTrashBtn}
                ref={trashBtn}
              >
                <div className="item__inner">
                  <BsFillTrash2Fill />
                  <span>Trash</span>
                </div>
              </button>
            </div>
          </div>
          {/* <a href="https://icons8.com/icon/11732/페이지-개요">페이지 개요 icon by Icons8</a> */}
          <div className="addNewPageBtn">
            <button title="button to make new page" onClick={addNewPage}>
              <AiOutlinePlus />
              <span>New page</span>
            </button>
          </div>
        </div>
      </div>
      <div id="moreFn" style={moreFnStyle} onTouchMove={onTouchMoveSideBar}>
        <button
          title="button to resize moreFn "
          className="resizeBar"
          onTouchStart={onTouchStartResizeBar}
        >
          <ScreenOnly text="button to resize moreFn" />
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
        <button
          title="button to delete"
          className="moreFn__btn btn-delete"
          onClick={onClickToDelete}
        >
          <div>
            <RiDeleteBin6Line />
            <span>Delete</span>
          </div>
        </button>
        {targetItem && user.favorites?.includes(targetItem.id) ? (
          <button
            title="button to remove to favorite"
            className="moreFn__btn"
            onClick={onClickToRemoveFavorite}
          >
            <div>
              <AiOutlineStar />
              <span>Remove to Favorites</span>
            </div>
          </button>
        ) : (
          <button
            title="button to add to favorite"
            className="moreFn__btn"
            onClick={onClickToAddFavorite}
          >
            <div>
              <AiOutlineStar />
              <span>Add to Favorites</span>
            </div>
          </button>
        )}
        <button
          title="button to duplicate"
          className="moreFn__btn"
          onClick={onClickToDuplicate}
        >
          <div>
            <HiOutlineDuplicate />
            <span>Duplicate</span>
            <span></span>
          </div>
        </button>
        <button
          title="button to rename"
          className="moreFn__btn"
          onClick={onClickToRename}
        >
          <div>
            <BsPencilSquare />
            <span>Rename</span>
          </div>
        </button>
        <button
          title="butotn to move  it to other page"
          className="moreFn__btn"
          onClick={onClickMoveToBtn}
        >
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
