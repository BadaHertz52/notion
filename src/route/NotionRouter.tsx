import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";

import { ActionContext } from "../contexts";

import {
  AllComments,
  QuickFindBoard,
  Templates,
  SideBarContainer,
  NonePage,
  Export,
  DiscardEditForm,
  EditorContainer,
  NotionHelmet,
} from "../components";

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
import { change_side } from "../modules/side/reducer";
import {
  add_favorites,
  add_recent_page,
  clean_recent_page,
  delete_recent_page,
  remove_favorites,
} from "../modules/user/reducer";
import {
  Block,
  Page,
  SideAppear,
  ListItem,
  ModalType,
  FontStyleType,
  MobileSideMenuType,
} from "../types";
import {
  findPage,
  getCurrentPageId,
  getEditTime,
  makeRoutePath,
} from "../utils";
import { SESSION_KEY } from "../constants";

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
    const editTime = getEditTime();

    if (firstPagesId && pagesId && pages) {
      const FIRST_LIST = firstPagesId.map((id: string) => {
        const PAGE: Page = findPage(pagesId, pages, id);
        const item: ListItem = {
          id: PAGE.id,
          title: PAGE.header.title,
          iconType: PAGE.header.iconType,
          icon: PAGE.header.icon,
          editTime: editTime,
          createTime: editTime,
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
  const [fontStyle, setFontStyle] = useState<FontStyleType>("default");
  const [modal, setModal] = useState<ModalType>({
    open: false,
    what: null,
  });
  const [mobileSideMenu, setMobileSideMenu] = useState<MobileSideMenuType>({
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
  useEffect(() => {
    if (window.location.search) {
      navigate(makeRoutePath(currentPageId));
    }
  }, [currentPageId, navigate]);

  useEffect(() => {
    const sessionItem = sessionStorage.getItem(SESSION_KEY.recentPages);
    const recentPagesId = sessionItem
      ? (JSON.parse(sessionItem) as string[])
      : null;
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

  return (
    <>
      <NotionHelmet pageHeader={currentPage?.header} pageId={currentPage?.id} />
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
                      firstList={firstList}
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
                      openExport={openExport}
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
    </>
  );
};

export default React.memo(NotionRouter);
