import { Dispatch, SetStateAction, memo, useCallback, useContext } from "react";
import { randomEmojiIcon } from "../modules/notion/emojiData";
import { makeNewBlock } from "../fn";
import { Page } from "../modules/notion/type";
import { ActionContext } from "../route/NotionRouter";
import { GrDocument, GrDocumentText } from "react-icons/gr";
import { HiTemplate } from "react-icons/hi";

type EmptyPageContentProps = {
  page: Page;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
};
const EmptyPageContent = ({
  page,
  setOpenTemplates,
}: EmptyPageContentProps) => {
  const { editPage } = useContext(ActionContext).actions;

  /**
   * 새로 만든 페이지에 firstBlock을 생성하면서 페이지에 내용을 작성할 수 있도록 하는 함수
   * @returns page
   */
  const startNewPage = useCallback((): Page => {
    const firstBlock = makeNewBlock(page, null, "");
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
    setOpenTemplates(false);
    editPage(page.id, newPageWithIcon);
  }, [editPage, page.header, page.id, setOpenTemplates, startNewPage]);

  const onClickEmpty = useCallback(() => {
    const newPage = startNewPage();
    setOpenTemplates(false);
    editPage(page.id, newPage);
  }, [editPage, page.id, setOpenTemplates, startNewPage]);

  const onClickTemplateBtn = useCallback(() => {
    setOpenTemplates(true);
    sessionStorage.setItem("targetPageId", page.id);
  }, [page.id, setOpenTemplates]);
  return (
    <>
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
          title="button to start  page with template"
          onClick={onClickTemplateBtn}
        >
          <HiTemplate />
          <span>Templates</span>
        </button>
      )}
    </>
  );
};

export default memo(EmptyPageContent);
