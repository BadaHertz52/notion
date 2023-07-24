import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CSSProperties } from "styled-components";
import AllComments from "../components/AllComments";
import Export from "../components/Export";
import Loading from "../components/Loading";
import QuickFindBoard from "../components/QuickFindBoard";
import Templates from "../components/Templates";
import { RootState } from "../modules";
import {
  add_block,
  add_page,
  change_block_to_page,
  change_page_to_block,
  change_to_sub,
  clean_trash,
  delete_block,
  delete_page,
  duplicate_page,
  edit_block,
  edit_page,
  move_page_to_page,
  pageSample,
  raise_block,
  restore_page,
} from "../modules/notion/reducer";
import { Block, Page, IconType, ListItem } from "../modules/notion/type";
import { emojiPath } from "../modules/notion/emojiData";
import { findPage, getCurrentPageId, makeRoutePath } from "../fn";
import { change_side, SideAppear } from "../modules/side/reducer";
import {
  add_favorites,
  add_recent_page,
  clean_recent_page,
  delete_recent_page,
  remove_favorites,
} from "../modules/user/reducer";
import EditorContainer, { ModalType } from "./EditorContainer";
import SideBarContainer from "./SideBarContainer";
const MOBILE_SIDE_MENU = {
  ms_turnInto: "ms_turnInto",
  ms_movePage: "ms_movePage",
  ms_color: "ms_color",
  ms_moreMenu: "ms_moreMenu",
  ms_link: "ms_link",
} as const;

export type msmWhatType = keyof typeof MOBILE_SIDE_MENU | undefined;
export type mobileSideMenuType = {
  block: Block | null;
  what: msmWhatType;
};
export type pathType = {
  id: string;
  title: string;
  icon: string | null;
  iconType: IconType;
};
export type DiscardItemType = {
  discard: boolean;
};
export type selectionType = {
  /**
   * origin block data (수정이전에 block data)
   */
  block: Block;
  /**
   * blockStyler에 의한 block data의 변화가 있는 지 여부
   */
  change: boolean;
};
export const defaultFontFamily =
  'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"';
export const serifFontFamily = "Lyon-Text, Georgia, ui-serif, serif";
export const monoFontFamily = "iawriter-mono, Nitti, Menlo, Courier, monospace";
export type fontStyleType =
  | typeof serifFontFamily
  | typeof monoFontFamily
  | typeof defaultFontFamily;

const initialNotionActions = {
  addBlock: (
    pageId: string,
    block: Block,
    newBlockIndex: number,
    previousBlockId: string | null
  ) => {},
  editBlock: (pageId: string, block: Block) => {},
  deleteBlock: (pageId: string, block: Block, isInMenu: boolean) => {},
  changeBlockToPage: (currentPageId: string, block: Block) => {},
  changePageToBlock: (currentPageId: string, block: Block) => {},
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => {},
  raiseBlock: (pageId: string, block: Block) => {},
  addPage: (newPage: Page) => {},
  deletePage: (pageId: string) => {},
  duplicatePage: (targetPageId: string) => {},
  editPage: (pageId: string, newPage: Page) => {},
  movePageToPage: (targetPageId: string, destinationPageId: string) => {},
  restorePage: (pageId: string) => {},
  cleanTrash: (pageId: string) => {},
  addRecentPage: (itemId: string) => {},
  cleanRecentPage: () => {},
  addFavorites: (itemId: string) => {},
  removeFavorites: (itemId: string) => {},
  changeSide: (appear: SideAppear) => {},
};
export const ActionContext = createContext({ actions: initialNotionActions });

const NotionRouter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notion = useSelector((state: RootState) => state.notion);
  const { pagesId, pages, firstPagesId } = notion;
  const trashPagesId = notion.trash.pagesId;
  const trashPages = notion.trash.pages;
  const user = useSelector((state: RootState) => state.user);
  const sideAppear = useSelector((state: RootState) => state.side.appear);
  const currentPageId = getCurrentPageId();
  const firstList: ListItem[] | null = useMemo(() => {
    if (firstPagesId && pagesId && pages) {
      const FIRST_LIST = firstPagesId.map((id: string) => {
        const PAGE: Page = findPage(pagesId, pages, id);
        const item: ListItem = {
          id: PAGE.id,
          title: PAGE.header.title,
          iconType: PAGE.header.iconType,
          icon: PAGE.header.icon,
          editTime: JSON.stringify(Date.now()),
          createTime: JSON.stringify(Date.now()),
          subPagesId: PAGE.subPagesId,
          parentsId: PAGE.parentsId,
        };
        return item;
      });
      return FIRST_LIST;
    } else {
      return null;
    }
  }, [firstPagesId, pages, pagesId]);

  const firstPage: Page | null = useMemo(() => {
    if (pagesId && pages) {
      return user.favorites
        ? findPage(pagesId, pages, user.favorites[0])
        : pages[0];
    } else {
      return null;
    }
  }, [pages, pagesId, user.favorites]);

  const [targetPageId, setTargetPageId] = useState<string>(
    user.favorites?.[0] ? user.favorites[0] : firstPage ? firstPage.id : "none"
  );

  const [routePage, setRoutePage] = useState<Page | null>(
    targetPageId !== "none" && pagesId && pages
      ? findPage(pagesId, pages, targetPageId)
      : null
  );
  const [openQF, setOpenQF] = useState<boolean>(false);
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  const [allCommentsStyle, setAllCommentsStyle] = useState<CSSProperties>({
    transform: `translateX(${window.innerWidth}px)`,
  });
  const [discard_edit, setDiscardEdit] = useState<boolean>(false);
  const discardEditHtml = document.getElementById("discardEdit");
  const [openExport, setOpenExport] = useState<boolean>(false);
  const [openComment, setOpenComment] = useState<boolean>(false);
  const [commentBlock, setCommentBlock] = useState<Block | null>(null);
  const [smallText, setSmallText] = useState<boolean>(false);
  const [fullWidth, setFullWidth] = useState<boolean>(false);
  const [openTemplates, setOpenTemplates] = useState<boolean>(false);
  const [fontStyle, setFontStyle] = useState<fontStyleType>(defaultFontFamily);
  const loading: boolean = !routePage;
  const [modal, setModal] = useState<ModalType>({
    open: false,
    what: null,
  });
  const [mobileSideMenu, setMobileSideMenu] = useState<mobileSideMenuType>({
    block: null,
    what: undefined,
  });
  //---action.function
  //--block
  const editBlock = (pageId: string, block: Block) => {
    dispatch(edit_block(pageId, block));
  };
  const changeBlockToPage = (currentPageId: string, block: Block) => {
    dispatch(change_block_to_page(currentPageId, block));
  };
  const changePageToBlock = (currentPageId: string, block: Block) => {
    dispatch(change_page_to_block(currentPageId, block));
  };
  const addBlock = (
    pageId: string,
    block: Block,
    newBlockIndex: number,
    previousBlockId: string | null
  ) => {
    dispatch(add_block(pageId, block, newBlockIndex, previousBlockId));
  };
  const deleteBlock = (pageId: string, block: Block, isInMenu: boolean) => {
    dispatch(delete_block(pageId, block, isInMenu));
  };
  const changeToSub = (
    pageId: string,
    block: Block,
    newParentBlockId: string
  ) => {
    dispatch(change_to_sub(pageId, block, newParentBlockId));
  };
  const raiseBlock = (pageId: string, block: Block) => {
    dispatch(raise_block(pageId, block));
  };
  //block--

  //--page
  function addPage(newPage: Page) {
    dispatch(add_page(newPage));
    setRoutePage(newPage);
  }
  function duplicatePage(targetPageId: string) {
    dispatch(duplicate_page(targetPageId));
  }
  function editPage(pageId: string, newPage: Page) {
    dispatch(edit_page(pageId, newPage));
  }
  function deletePage(pageId: string) {
    if (pageId === currentPageId && firstPagesId) {
      const openOtherFirstPage = () => {
        firstPagesId[0] === pageId
          ? firstPagesId.length > 1
            ? setTargetPageId(firstPagesId[1])
            : setTargetPageId("none")
          : setTargetPageId(firstPagesId[0]);
      };
      if (user.favorites) {
        if (user.favorites.includes(pageId)) {
          user.favorites[0] === pageId
            ? user.favorites.length > 1
              ? setTargetPageId(user.favorites[1])
              : openOtherFirstPage()
            : setTargetPageId(user.favorites[0]);
        } else {
          setTargetPageId(user.favorites[0]);
        }
      } else {
        openOtherFirstPage();
      }
    }
    setTimeout(() => {
      dispatch(delete_page(pageId));
      dispatch(delete_recent_page(pageId));
    }, 1000);
    if (user.favorites) {
      user.favorites?.includes(pageId) && dispatch(remove_favorites(pageId));
    }
  }
  function movePageToPage(targetPageId: string, destinationPageId: string) {
    dispatch(move_page_to_page(targetPageId, destinationPageId));
  }
  const restorePage = (pageId: string) => {
    dispatch(restore_page(pageId));
  };
  const cleanTrash = (pageId: string) => {
    dispatch(clean_trash(pageId));
    if (routePage?.id === pageId) {
      setRoutePage(firstPage);
    }
  };
  //page---

  //--user
  const addRecentPage = useCallback(
    (itemId: string) => {
      dispatch(add_recent_page(itemId));
    },
    [dispatch]
  );
  const cleanRecentPage = () => {
    dispatch(clean_recent_page());
  };
  const addFavorites = (itemId: string) => {
    dispatch(add_favorites(itemId));
  };
  const removeFavorites = (itemId: string) => {
    dispatch(remove_favorites(itemId));
  };
  //---user

  //--side
  const changeSide = useCallback(
    (appear: SideAppear) => {
      dispatch(change_side(appear));
    },
    [dispatch]
  );
  //side--

  //action.function ---
  const notionActions = {
    addBlock: addBlock,
    editBlock: editBlock,
    deleteBlock: deleteBlock,
    changeBlockToPage: changeBlockToPage,
    changePageToBlock: changePageToBlock,
    changeToSub: changeToSub,
    raiseBlock: raiseBlock,
    addPage: addPage,
    deletePage: deletePage,
    duplicatePage: duplicatePage,
    editPage: editPage,
    movePageToPage: movePageToPage,
    restorePage: restorePage,
    cleanTrash: cleanTrash,
    addRecentPage: addRecentPage,
    cleanRecentPage: cleanRecentPage,
    addFavorites: addFavorites,
    removeFavorites: removeFavorites,
    changeSide: changeSide,
  };

  const onClickDiscardEdit = () => {
    discardEditHtml?.classList.remove("on");
    setDiscardEdit(true);
  };

  const onClickCloseEdit = () => {
    discardEditHtml?.classList.remove("on");
    setDiscardEdit(false);
  };
  const changeTitle = (title: string) => {
    const titleHtml = document.querySelector("title");
    if (titleHtml) {
      titleHtml.innerText = title;
    } else {
      console.error("Can't find <title>");
    }
  };

  const changeFavicon = (icon: string | null, iconType: IconType) => {
    const shortcutIcon = document.querySelector(
      "link[rel='shortcut icon']"
    ) as HTMLLinkElement | null;
    const changeHref = (href: string) =>
      shortcutIcon?.setAttribute("href", href);
    if (shortcutIcon) {
      switch (iconType) {
        case null:
          changeHref("./favicon.ico");
          break;
        case "img":
          if (icon) {
            changeHref(icon);
          }
          break;
        case "emoji":
          changeHref(`${emojiPath}${icon}.png`);
          break;
        default:
          break;
      }
    } else {
      console.error("Can't find shortcut icon");
    }
  };
  useEffect(() => {
    if (!currentPageId && routePage && pagesId && pages) {
      const path = makeRoutePath(routePage.id);
      navigate(path);
    }
  }, [currentPageId, routePage, pagesId, pages, navigate]);
  useEffect(() => {
    if (routePage && pagesId && pages) {
      changeTitle(routePage.header.title);
      changeFavicon(routePage.header.icon, routePage.header.iconType);
      addRecentPage(routePage.id);
    }
  }, [routePage, navigate, pages, pagesId, addRecentPage]);

  useEffect(() => {
    //url 변경시
    if (currentPageId !== routePage?.id) {
      if (pagesId?.includes(currentPageId) && pages && pagesId) {
        const page = findPage(pagesId, pages, currentPageId);
        setRoutePage(page);
        setTargetPageId(page.id);
      } else if (trashPagesId?.includes(currentPageId) && trashPages) {
        const page = findPage(trashPagesId, trashPages, currentPageId);
        setRoutePage(page);
        setTargetPageId(page.id);
      } else {
        setRoutePage(firstPage);
        setTargetPageId(firstPage ? firstPage.id : "none");
      }
    }
  }, [
    routePage,
    pages,
    pagesId,
    trashPagesId,
    trashPages,
    firstPage,
    currentPageId,
  ]);

  useEffect(() => {
    //sideBar 에서 페이지 이동 시
    if (targetPageId === "none") {
      setRoutePage(null);
      changeSide("lock");
    } else {
      if (targetPageId !== routePage?.id && pagesId && pages) {
        const newRoutePage = findPage(pagesId, pages, targetPageId);
        setRoutePage(newRoutePage);
        const path = makeRoutePath(newRoutePage.id);
        navigate(path);
      }
    }
  }, [
    pages,
    pagesId,
    targetPageId,
    notion.pagesId,
    changeSide,
    routePage,
    navigate,
  ]);

  useEffect(() => {
    const innerWidth = window.innerWidth;
    if (showAllComments) {
      innerWidth > 768
        ? setAllCommentsStyle({
            transform: `translateX(0)`,
          })
        : setAllCommentsStyle({
            transform: `translateY(0)`,
          });
    } else {
      const allCommentsHtml = document.getElementById("allComments");
      const width = allCommentsHtml?.clientWidth;
      if (innerWidth > 768) {
        width &&
          setAllCommentsStyle({
            transform: `translateX(${width + 50}px)`,
          });
      } else {
        setAllCommentsStyle({
          transform: `translateY(110%)`,
        });
      }
    }
  }, [showAllComments]);
  return (
    <ActionContext.Provider value={{ actions: notionActions }}>
      <div id="inner" className="sideBar-lock">
        {loading ? (
          <Loading />
        ) : (
          <>
            <SideBarContainer
              sideAppear={sideAppear}
              setTargetPageId={setTargetPageId}
              setOpenQF={setOpenQF}
              setOpenTemplates={setOpenTemplates}
              showAllComments={showAllComments}
            />
            {routePage && pagesId && pages && firstList ? (
              <>
                <Routes>
                  {/* <Route
                    path={makeRoutePath(routePage, pagesId, pages)}
                    element={
                      <EditorContainer
                        sideAppear={sideAppear}
                        firstList={firstList}
                        userName={user.userName}
                        recentPagesId={user.recentPagesId}
                        page={routePage}
                        pages={pages}
                        pagesId={pagesId}
                        isInTrash={!pagesId.includes(routePage.id)}
                        setTargetPageId={setTargetPageId}
                        setRoutePage={setRoutePage}
                        showAllComments={showAllComments}
                        setShowAllComments={setShowAllComments}
                        discardEdit={discard_edit}
                        setDiscardEdit={setDiscardEdit}
                        setOpenExport={setOpenExport}
                        modal={modal}
                        setModal={setModal}
                        openComment={openComment}
                        setOpenComment={setOpenComment}
                        commentBlock={commentBlock}
                        setCommentBlock={setCommentBlock}
                        smallText={smallText}
                        setSmallText={setSmallText}
                        fullWidth={fullWidth}
                        setFullWidth={setFullWidth}
                        openTemplates={openTemplates}
                        setOpenTemplates={setOpenTemplates}
                        fontStyle={fontStyle}
                        setFontStyle={setFontStyle}
                        mobileSideMenu={mobileSideMenu}
                        setMobileSideMenu={setMobileSideMenu}
                      />
                    }
                  /> */}
                  {pages.map((p) => (
                    <Route
                      path={makeRoutePath(p.id)}
                      element={
                        <EditorContainer
                          sideAppear={sideAppear}
                          firstList={firstList}
                          userName={user.userName}
                          recentPagesId={user.recentPagesId}
                          page={p}
                          pages={pages}
                          pagesId={pagesId}
                          isInTrash={!pagesId.includes(p.id)}
                          setTargetPageId={setTargetPageId}
                          setRoutePage={setRoutePage}
                          showAllComments={showAllComments}
                          setShowAllComments={setShowAllComments}
                          discardEdit={discard_edit}
                          setDiscardEdit={setDiscardEdit}
                          setOpenExport={setOpenExport}
                          modal={modal}
                          setModal={setModal}
                          openComment={openComment}
                          setOpenComment={setOpenComment}
                          commentBlock={commentBlock}
                          setCommentBlock={setCommentBlock}
                          smallText={smallText}
                          setSmallText={setSmallText}
                          fullWidth={fullWidth}
                          setFullWidth={setFullWidth}
                          openTemplates={openTemplates}
                          setOpenTemplates={setOpenTemplates}
                          fontStyle={fontStyle}
                          setFontStyle={setFontStyle}
                          mobileSideMenu={mobileSideMenu}
                          setMobileSideMenu={setMobileSideMenu}
                        />
                      }
                    />
                  ))}
                </Routes>
                {openExport && (
                  <Export
                    page={routePage}
                    pagesId={pagesId}
                    pages={pages}
                    firstList={firstList}
                    userName={user.userName}
                    recentPagesId={user.recentPagesId}
                    setOpenExport={setOpenExport}
                    commentBlock={commentBlock}
                    openComment={openComment}
                    modal={modal}
                    setModal={setModal}
                    setTargetPageId={setTargetPageId}
                    setRoutePage={setRoutePage}
                    setOpenComment={setOpenComment}
                    setCommentBlock={setCommentBlock}
                    showAllComments={showAllComments}
                    smallText={smallText}
                    fullWidth={fullWidth}
                    discardEdit={discard_edit}
                    setDiscardEdit={setDiscardEdit}
                    openTemplates={openTemplates}
                    setOpenTemplates={setOpenTemplates}
                    fontStyle={fontStyle}
                    mobileSideMenu={mobileSideMenu}
                    setMobileSideMenu={setMobileSideMenu}
                  />
                )}
                {openTemplates && (
                  <Templates
                    routePageId={routePage.id}
                    user={user}
                    userName={user.userName}
                    pagesId={pagesId}
                    pages={pages}
                    firstList={firstList}
                    recentPagesId={user.recentPagesId}
                    setRoutePage={setRoutePage}
                    setTargetPageId={setTargetPageId}
                    commentBlock={commentBlock}
                    openComment={openComment}
                    setOpenComment={setOpenComment}
                    modal={modal}
                    setModal={setModal}
                    openTemplates={openTemplates}
                    setOpenTemplates={setOpenTemplates}
                    setCommentBlock={setCommentBlock}
                    showAllComments={showAllComments}
                    smallText={smallText}
                    fullWidth={fullWidth}
                    discardEdit={discard_edit}
                    setDiscardEdit={setDiscardEdit}
                    fontStyle={fontStyle}
                    mobileSideMenu={mobileSideMenu}
                    setMobileSideMenu={setMobileSideMenu}
                  />
                )}
                {routePage && (
                  <AllComments
                    page={routePage}
                    userName={user.userName}
                    favorites={user.favorites}
                    showAllComments={showAllComments}
                    setShowAllComments={setShowAllComments}
                    discardEdit={discard_edit}
                    setDiscardEdit={setDiscardEdit}
                    style={allCommentsStyle}
                  />
                )}
                {openQF && (
                  <QuickFindBoard
                    userName={user.userName}
                    recentPagesId={user.recentPagesId}
                    pages={pages}
                    pagesId={pagesId}
                    cleanRecentPage={cleanRecentPage}
                    setTargetPageId={setTargetPageId}
                    setOpenQF={setOpenQF}
                  />
                )}
              </>
            ) : (
              <div className="editor nonePage">
                <p>Page doesn't existence</p>
                <p>Try make new Page</p>
                <button
                  title="button to make new page"
                  onClick={() => addPage(pageSample)}
                >
                  Make new page
                </button>
              </div>
            )}
            {/* ----editor */}
          </>
        )}
        <div id="discardEdit" className="discardEdit">
          <div className="inner">
            <div className="question">
              <div>Do you want to discard this edit?</div>
            </div>
            <div className="btn-group">
              <button title="button to discard" onClick={onClickDiscardEdit}>
                Discard
              </button>
              <button title="close button" onClick={onClickCloseEdit}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </ActionContext.Provider>
  );
};

export default React.memo(NotionRouter);
