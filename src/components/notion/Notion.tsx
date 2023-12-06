import React, { useMemo, useState } from "react";

import { NotionHelmet } from "..";
import { SideBarContainer } from "../index";
import { SideBarContainerProp } from "../sideBar/SideBarContainer";
import NotionRouter from "../../route/NotionRouter";

import {
  Block,
  FontStyleType,
  ListItem,
  MobileSideMenuType,
  ModalType,
  Page,
} from "../../types";
import { findPage } from "../../utils";
import { ModalContext } from "../../contexts";
import { UserState } from "../../modules/user/reducer";

type NotionProps = Omit<SideBarContainerProp, "firstPages" | "firstList"> & {
  user: UserState;
  currentPage: Page | null;
  currentPageId: string | undefined;
  pages: Page[] | null;
  pagesId: string[] | null;
  firstPagesId: string[] | null;
};
const Notion = ({ ...props }: NotionProps) => {
  const { currentPage, pagesId, pages, firstPagesId } = props;

  const initialMortal: ModalType = {
    open: false,
    target: undefined,
    block: undefined,
  };
  const [modal, setMortal] = useState<ModalType>(initialMortal);
  //TODO -  수정
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
  const [mobileSideMenu, setMobileSideMenu] = useState<MobileSideMenuType>({
    block: null,
    what: undefined,
  });
  /**
   *
   * @param newModal  변경할 모달이 있을 경우에는 값을 입력하고, 처음 모달 상태로 되돌리려하는 경우네는 값을 비워두면 됨
   */
  const changeModal = (newModal?: ModalType) => {
    setMortal(newModal ? newModal : initialMortal);
  };

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
      <div id="inner" className="notion__inner sideBar-lock">
        <ModalContext.Provider value={{ changeModal: changeModal }}>
          <SideBarContainer
            {...props}
            firstList={firstList}
            firstPages={firstPages}
          />
          <NotionRouter
            {...props}
            firstList={firstList}
            openComment={openComment}
            setOpenComment={setOpenComment}
            commentBlock={commentBlock}
            setCommentBlock={setCommentBlock}
            smallText={smallText}
            setSmallText={setSmallText}
            fullWidth={fullWidth}
            setFullWidth={setFullWidth}
            showAllComments={showAllComments}
            setShowAllComments={setShowAllComments}
            discardEdit={discard_edit}
            setDiscardEdit={setDiscardEdit}
            openTemplates={openTemplates}
            setOpenTemplates={setOpenTemplates}
            setOpenExport={setOpenExport}
            fontStyle={fontStyle}
            setFontStyle={setFontStyle}
            mobileSideMenu={mobileSideMenu}
            setMobileSideMenu={setMobileSideMenu}
          />
        </ModalContext.Provider>
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
          <DiscardEditForm setDiscardEdit={setDiscardEdit} /> */}
      </div>
    </div>
  );
};

export default React.memo(Notion);
