import { memo, useCallback, useContext } from "react";

import { GrDocument, GrDocumentText } from "react-icons/gr";
import { HiTemplate } from "react-icons/hi";

import { makeNewBlock, randomEmojiIcon } from "../../utils";
import { Page } from "../../types";
import { ActionContext } from "../../contexts";
import { SESSION_KEY } from "../../constants";

type EmptyPageContentProps = {
  page: Page;
  openTemplates: () => void;
};

const EmptyPageContent = ({ page, openTemplates }: EmptyPageContentProps) => {
  const { editPage } = useContext(ActionContext).actions;
  /**
   * 새로 만든 페이지에 firstBlock을 생성하면서 페이지에 내용을 작성할 수 있도록 하는 함수
   * @returns page
   */
  const startNewPage = useCallback((): Page => {
    const firstBlock = makeNewBlock(page, null);
    const newPage: Page = {
      ...page,
      header: {
        ...page.header,
      },
      blocks: [firstBlock],
      blocksId: [firstBlock.id],
      firstBlocksId: [firstBlock.id],
      editTime: JSON.stringify(Date.now()),
    };
    return newPage;
  }, [page]);

  const onClickEmptyWithIconBtn = useCallback(() => {
    const icon = randomEmojiIcon();
    const newPage = startNewPage();
    const newPageWithIcon: Page = {
      ...newPage,
      header: {
        ...page.header,
        icon: icon,
        iconType: "emoji",
      },
    };

    editPage(page.id, newPageWithIcon);
  }, [editPage, page.header, page.id, startNewPage]);

  const onClickEmpty = useCallback(() => {
    const newPage = startNewPage();

    editPage(page.id, newPage);
  }, [editPage, page.id, startNewPage]);

  const onClickTemplateBtn = useCallback(() => {
    openTemplates();
    sessionStorage.setItem(SESSION_KEY.targetPageId, page.id);
  }, [page.id, openTemplates]);

  return (
    <div className="empty-page__btn-group">
      <button
        title="button to start empty page with icon"
        onClick={onClickEmptyWithIconBtn}
      >
        <GrDocumentText />
        <span>Empty with icon</span>
      </button>
      <button title="button to start empty page " onClick={onClickEmpty}>
        <GrDocument />
        <span>Empty</span>
      </button>
      {page.type !== "template" && (
        <button
          className="btn-open-templates"
          title="button to start  page with template"
          onClick={onClickTemplateBtn}
        >
          <HiTemplate />
          <span>Templates</span>
        </button>
      )}
    </div>
  );
};

export default memo(EmptyPageContent);
