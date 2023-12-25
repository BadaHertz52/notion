import React, { useCallback, useMemo, useState } from "react";

import { NotionHelmet } from "..";
import { SideBarContainer } from "../index";
import { SideBarContainerProp } from "../containers/SideBarContainer";
import NotionRouter from "../../route/NotionRouter";

import {
  Block,
  FontStyle,
  ListItem,
  ModalType,
  Page,
  UserState,
} from "../../types";
import { findPage } from "../../utils";
import TemplateModal from "../modals/TemplateModal";
import { SESSION_KEY } from "../../constants";

type NotionProps = Omit<
  SideBarContainerProp,
  "firstPages" | "firstList" | "openTemplates"
> & {
  user: UserState;
  currentPage: Page | null;
  currentPageId: string | undefined;
  pages: Page[] | null;
  pagesId: string[] | null;
  firstPagesId: string[] | null;
};
const Notion = ({ ...props }: NotionProps) => {
  const { currentPage, pagesId, pages, firstPagesId } = props;
  //TODO -  수정
  const [templateModal, setTemplateModal] = useState<ModalType>({
    target: "templates",
    open: false,
  });
  const [openExport, setOpenExport] = useState<boolean>(false);
  const [smallText, setSmallText] = useState<boolean>(false);
  const [fullWidth, setFullWidth] = useState<boolean>(false);

  const [fontStyle, setFontStyle] = useState<FontStyle>("default");

  const closeTemplates = useCallback(() => {
    setTemplateModal((prev) => ({ ...prev, open: false }));
    sessionStorage.removeItem(SESSION_KEY.originTemplate);
  }, []);

  const openTemplates = useCallback(() => {
    setTemplateModal((prev) => ({ ...prev, open: true }));
  }, []);
  /**
   *
   * @param newModal  변경할 모달이 있을 경우에는 값을 입력하고, 처음 모달 상태로 되돌리려하는 경우네는 값을 비워두면 됨
   */

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
  return (
    <div id="notion">
      <NotionHelmet pageHeader={currentPage?.header} pageId={currentPage?.id} />
      <div id="notion__inner">
        <SideBarContainer
          {...props}
          firstList={firstList}
          firstPages={firstPages}
          openTemplates={openTemplates}
        />
        <NotionRouter
          {...props}
          firstList={firstList}
          smallText={smallText}
          setSmallText={setSmallText}
          fullWidth={fullWidth}
          setFullWidth={setFullWidth}
          setOpenExport={setOpenExport}
          fontStyle={fontStyle}
          setFontStyle={setFontStyle}
          openTemplates={openTemplates}
        />
        {props.currentPage?.id && (
          <TemplateModal
            {...props}
            routePageId={props.currentPage.id}
            userName={props.user.userName}
            recentPagesId={props.user.recentPagesId}
            firstList={firstList}
            smallText={smallText}
            fullWidth={fullWidth}
            fontStyle={fontStyle}
            templateModal={templateModal}
            closeTemplates={closeTemplates}
          />
        )}
        {/* {pagesId && pages && firstList && (
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


            </>
          )}
           */}
      </div>
    </div>
  );
};

export default React.memo(Notion);
