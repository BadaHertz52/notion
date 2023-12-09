import React, { useCallback, useContext, useEffect, useMemo } from "react";

import { Route, Routes, useNavigate } from "react-router-dom";

import { NonePage, EditorContainer } from "../components";
import { EditorContainerProps } from "../components/containers/EditorContainer";

import { SESSION_KEY } from "../constants";
import { ListItem, Page } from "../types";
import { ActionContext } from "../contexts";
import { findPage, makeRoutePath } from "../utils";
import { UserState } from "../modules/user/reducer";

export type NotionRouterProps = Omit<
  EditorContainerProps,
  "pages" | "pagesId" | "page" | "firstList" | "isInTrash"
> & {
  user: UserState;
  currentPageId: string | undefined;
  pages: Page[] | null;
  pagesId: string[] | null;
  firstList: ListItem[] | null;
};

const NotionRouter = ({ ...props }: NotionRouterProps) => {
  const { pages, pagesId, user, currentPageId, firstList } = props;

  const { addRecentPage } = useContext(ActionContext).actions;

  const navigate = useNavigate();

  const firstPage: Page | null = useMemo(() => {
    if (pagesId && pages) {
      return user.favorites
        ? findPage(pagesId, pages, user.favorites[0])
        : pages[0];
    } else {
      return null;
    }
  }, [pages, pagesId, user.favorites]);
  /**
   * notion 패이지를 열었을 때, 즐겨찾기 페이지 또는 첫번째 페이지로 이동하는 함수
   */
  const movePage = useCallback(() => {
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
      if (currentPageId && pagesId?.includes(currentPageId)) {
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

  useEffect(() => {
    if (window.location.search && currentPageId) {
      navigate(makeRoutePath(currentPageId));
    }
  }, [currentPageId, navigate]);

  useEffect(() => {
    movePage();
  }, [movePage]);

  return (
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
                {...props}
                firstList={firstList}
                page={p}
                isInTrash={!pagesId.includes(p.id)}
              />
            }
          />
        ))}
      <Route path={"*"} element={<NonePage />} />
    </Routes>
  );
};

export default React.memo(NotionRouter);
