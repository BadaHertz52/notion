import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";

import AllComments from "../components/AllComments";
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
  recentPagesSessionKey,
  remove_favorites,
} from "../modules/user/reducer";
import EditorContainer, { ModalType } from "../containers/EditorContainer";
import SideBarContainer from "../containers/SideBarContainer";
import NonePage from "../components/NonePage";
import Export from "../components/Export";
import DiscardEditForm from "../components/DiscardEditForm";
const MOBILE_SIDE_MENU = {
  ms_turnInto: "ms_turnInto",
  ms_movePage: "ms_movePage",
  ms_color: "ms_color",
  ms_moreMenu: "ms_moreMenu",
  ms_link: "ms_link",
} as const;

export type MobileSideMenuWhatType = keyof typeof MOBILE_SIDE_MENU | undefined;
export type mobileSideMenuType = {
  block: Block | null;
  what: MobileSideMenuWhatType;
};
export type PathType = {
  id: string;
  title: string;
  icon: string | null;
  iconType: IconType;
};
export type DiscardItemType = {
  discard: boolean;
};
export type SelectionType = {
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
export type FontStyleType =
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
  const user = useSelector((state: RootState) => state.user);
  const sideAppear = useSelector((state: RootState) => state.side.appear);
  const currentPageId: string = getCurrentPageId();
  const currentPage = useMemo(
    () =>
      pages &&
      pagesId &&
      currentPageId &&
      findPage(pagesId, pages, currentPageId),
    [pages, pagesId, currentPageId]
  ) as Page | null;
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

  const [openQF, setOpenQF] = useState<boolean>(false);
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  const [discard_edit, setDiscardEdit] = useState<boolean>(false);
  const [openExport, setOpenExport] = useState<boolean>(false);
  const [openComment, setOpenComment] = useState<boolean>(false);
  const [commentBlock, setCommentBlock] = useState<Block | null>(null);
  const [smallText, setSmallText] = useState<boolean>(false);
  const [fullWidth, setFullWidth] = useState<boolean>(false);
  const [openTemplates, setOpenTemplates] = useState<boolean>(false);
  const [fontStyle, setFontStyle] = useState<FontStyleType>(defaultFontFamily);
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
    navigate(makeRoutePath(newPage.id));
  }
  function duplicatePage(targetPageId: string) {
    dispatch(duplicate_page(targetPageId));
  }
  function editPage(pageId: string, newPage: Page) {
    dispatch(edit_page(pageId, newPage));
  }
  const openOtherFirstPage = (pageId: string) => {
    if (firstPagesId) {
      firstPagesId[0] === pageId
        ? firstPagesId.length > 1
          ? navigate(makeRoutePath(firstPagesId[1]))
          : navigate("/")
        : navigate(makeRoutePath(firstPagesId[0]));
    }
  };

  function deletePage(pageId: string) {
    if (pageId === currentPageId && firstPagesId) {
      if (user.favorites) {
        if (user.favorites.includes(pageId)) {
          user.favorites[0] === pageId
            ? user.favorites.length > 1
              ? navigate(makeRoutePath(user.favorites[1]))
              : openOtherFirstPage(pageId)
            : navigate(makeRoutePath(user.favorites[0]));
        } else {
          navigate(makeRoutePath(user.favorites[0]));
        }
      } else {
        openOtherFirstPage(pageId);
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
    if (currentPage?.id === pageId) {
      navigate("/");
    }
  };
  //page---

  //--user
  /**
   * 최근 방문한 페이지 목록에 itemId가 있지 않을 때, 최근 방문한 페이지 목록과 sessionStorage 에 itemId를 추가
   * @param itemId  방문 목록에 추가할 페이지 id
   */
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
    if (window.location.search) {
      navigate(makeRoutePath(currentPageId));
    }
  }, [currentPageId, navigate]);
  useEffect(() => {
    const sessionItem = sessionStorage.getItem(recentPagesSessionKey);
    const recentPagesId = sessionItem ? JSON.parse(sessionItem) : null;
    const openFirst = !recentPagesId && !currentPageId;
    if (openFirst && pagesId && pages) {
      // 처음 페이지를 열었을 떼, 지정된 페이지 열기 (즐겨찾기 -> 페이지)
      let pageId = "";
      if (user.favorites) {
        pageId = user.favorites[0];
      } else if (firstPage) {
        pageId = firstPage.id;
      }
      const path = makeRoutePath(pageId);
      navigate(path);
    } else {
      if (pagesId?.includes(currentPageId)) {
        if (recentPagesId) {
          const last = recentPagesId[recentPagesId.length - 1];
          if (last !== currentPageId) {
            //동일 페이지 내에서 새로 고침 시, recentPagesId 에 추가되는 거 막음
            addRecentPage(currentPageId);
          }
        } else {
          addRecentPage(currentPageId);
        }
      }
    }
  }, [
    currentPageId,
    firstPage,
    user.favorites,
    pagesId,
    pages,
    navigate,
    addRecentPage,
  ]);

  // change title and favicon
  useEffect(() => {
    const title = document.querySelector("title")?.text;
    if (currentPage?.header) {
      title !== currentPage.header.title &&
        changeTitle(currentPage.header.title);
      changeFavicon(currentPage.header.icon, currentPage.header.iconType);
    }
  }, [currentPage?.header, currentPage?.id, user.recentPagesId]);

  return (
    <ActionContext.Provider value={{ actions: notionActions }}>
      <div id="inner" className="sideBar-lock">
        <SideBarContainer
          sideAppear={sideAppear}
          setOpenQF={setOpenQF}
          setOpenTemplates={setOpenTemplates}
          showAllComments={showAllComments}
        />
        <Routes>
          {pagesId &&
            pages &&
            firstList &&
            pages.map((p) => (
              <Route
                key={`page_${p.id}`}
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
          <Route path={"*"} element={<NonePage addPage={addPage} />} />
        </Routes>
        {pagesId && pages && firstList && (
          <>
            {openExport && currentPage && (
              <Export
                page={currentPage}
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
            {openTemplates && currentPage && (
              <Templates
                routePageId={currentPage.id}
                user={user}
                userName={user.userName}
                pagesId={pagesId}
                pages={pages}
                firstList={firstList}
                recentPagesId={user.recentPagesId}
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
            {currentPage && (
              <AllComments
                page={currentPage}
                userName={user.userName}
                favorites={user.favorites}
                showAllComments={showAllComments}
                setShowAllComments={setShowAllComments}
                discardEdit={discard_edit}
                setDiscardEdit={setDiscardEdit}
              />
            )}
            {openQF && (
              <QuickFindBoard
                userName={user.userName}
                recentPagesId={user.recentPagesId}
                pages={pages}
                pagesId={pagesId}
                cleanRecentPage={cleanRecentPage}
                setOpenQF={setOpenQF}
              />
            )}
          </>
        )}
        <DiscardEditForm setDiscardEdit={setDiscardEdit} />
      </div>
    </ActionContext.Provider>
  );
};

export default React.memo(NotionRouter);
