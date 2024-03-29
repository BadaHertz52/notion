import React, { useCallback, useMemo, useState } from "react";

import { NotionHelmet, SideBar } from "..";

import NotionRouter from "../../route/NotionRouter";
import { TemplatesContainer } from "../index";
import { SideBarProps } from "../sideBar/SideBar";

import { INITIAL_MODAL, SESSION_KEY } from "../../constants";
import { FontStyle, ListItem, ModalType, Page, UserState } from "../../types";
import { findPage } from "../../utils";

type NotionProps = Omit<
  SideBarProps,
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

  const [templateModal, setTemplateModal] = useState<ModalType>(INITIAL_MODAL);
  const [smallText, setSmallText] = useState<boolean>(false);
  const [fullWidth, setFullWidth] = useState<boolean>(false);
  const [fontStyle, setFontStyle] = useState<FontStyle>("default");

  const closeTemplates = useCallback(() => {
    setTemplateModal(INITIAL_MODAL);
    sessionStorage.removeItem(SESSION_KEY.originTemplate);
  }, []);

  const openTemplates = useCallback(() => {
    setTemplateModal({ target: "templates", open: true });
  }, []);
  /**
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
        <SideBar
          {...props}
          firstList={firstList}
          firstPages={firstPages}
          openTemplates={openTemplates}
        />
        <NotionRouter
          {...props}
          {...props.user}
          firstList={firstList}
          smallText={smallText}
          setSmallText={setSmallText}
          fullWidth={fullWidth}
          setFullWidth={setFullWidth}
          fontStyle={fontStyle}
          setFontStyle={setFontStyle}
          openTemplates={openTemplates}
          isOpenTemplate={templateModal.open}
        />
        {props.currentPage?.id && (
          <TemplatesContainer
            {...props}
            routePageId={props.currentPage.id}
            userName={props.user.userName}
            recentPagesId={props.user.recentPagesId}
            firstList={firstList}
            smallText={smallText}
            fullWidth={fullWidth}
            fontStyle={fontStyle}
            templateModal={templateModal}
            setTemplateModal={setTemplateModal}
            closeTemplates={closeTemplates}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(Notion);
