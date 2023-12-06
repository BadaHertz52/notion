import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ActionContext } from "../../contexts";

import { RootState } from "../../modules";
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
} from "../../modules/notion/reducer";
import { change_side } from "../../modules/side/reducer";
import {
  add_favorites,
  add_recent_page,
  clean_recent_page,
  delete_recent_page,
  remove_favorites,
} from "../../modules/user/reducer";
import { Block, Page, SideAppear } from "../../types";
import { findPage, getCurrentPageId, makeRoutePath } from "../../utils";

import Notion from "../notion/Notion";

const NotionContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rootState = useSelector((state: RootState) => state);
  const { notion, user } = rootState;
  const { firstPagesId, pages, pagesId } = notion;

  const currentPageId = getCurrentPageId();
  const currentPage = useMemo(
    () =>
      pages && pagesId && currentPageId
        ? findPage(pagesId, pages, currentPageId)
        : null,
    [pages, pagesId, currentPageId]
  );

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

  return (
    <ActionContext.Provider value={{ actions: notionActions }}>
      <Notion
        user={user}
        pages={pages}
        pagesId={pagesId}
        firstPagesId={firstPagesId}
        currentPage={currentPage}
        currentPageId={currentPageId}
      />
    </ActionContext.Provider>
  );
};

export default React.memo(NotionContainer);
