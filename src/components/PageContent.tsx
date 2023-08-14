import React, {
  Dispatch,
  MouseEvent,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import { Block, Page } from "../modules/notion/type";
import { blockSample } from "../modules/notion/reducer";
import { ActionContext, SelectionType } from "../route/NotionRouter";
import { setTemplateItem } from "../fn";
import EditableBlock from "./EditableBlock";
import { Command } from "./Frame";
import EmptyPageContent from "./EmptyPageContent";

export type PageContentProps = {
  pages: Page[];
  pagesId: string[];
  page: Page;
  templateHtml: HTMLElement | null;
  newPageFrame: boolean;
  firstBlocks: Block[] | null;
  fontSize: number;
  isMoved: MutableRefObject<boolean>;
  pointBlockToMoveBlock: MutableRefObject<Block | null>;
  setMoveTargetBlock: Dispatch<SetStateAction<Block | null>>;
  makeMoveBlockTrue: () => void;
  command: Command;
  setCommand: Dispatch<SetStateAction<Command>>;
  openComment: boolean;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  setCommentBlock: Dispatch<SetStateAction<Block | null>>;
  setOpenLoader: Dispatch<SetStateAction<boolean>>;
  setLoaderTargetBlock: Dispatch<SetStateAction<Block | null>>;
  closeMenu: (event: globalThis.MouseEvent | MouseEvent) => void;
  setSelection: Dispatch<SetStateAction<SelectionType | null>>;
  setMobileMenuTargetBlock: Dispatch<SetStateAction<Block | null>>;
  mobileMenuTargetBlock: Block | null;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
};
const PageContent = ({
  pages,
  pagesId,
  page,
  templateHtml,
  newPageFrame,
  firstBlocks,
  fontSize,
  isMoved,
  pointBlockToMoveBlock,
  makeMoveBlockTrue,
  setMoveTargetBlock,
  command,
  setCommand,
  openComment,
  setOpenComment,
  setCommentBlock,
  setOpenLoader,
  setLoaderTargetBlock,
  closeMenu,
  setSelection,
  setMobileMenuTargetBlock,
  mobileMenuTargetBlock,
  setOpenTemplates,
}: PageContentProps) => {
  const { addBlock } = useContext(ActionContext).actions;

  /**
   * .pageContent의 밑부분을 클릭 할때, 해당 페이지에 새로운 블록을 추가하는 함수
   * @param event
   */
  const onClickPageContentBottom = useCallback(
    (event: MouseEvent) => {
      const pageContentEl = event.currentTarget;
      const clientX = event.clientX;
      const clientY = event.clientY;

      if (pageContentEl) {
        const pageContentDomRect = pageContentEl.getClientRects()[0];
        const pageContentPadding = getComputedStyle(
          pageContentEl,
          null
        ).getPropertyValue("padding-bottom");
        const padding = Number(
          pageContentPadding.slice(0, pageContentPadding.indexOf("px"))
        );

        const conditionX =
          clientX >= pageContentDomRect.x &&
          clientX <= pageContentDomRect.right;

        const conditionY =
          clientY >= pageContentDomRect.bottom - padding &&
          clientY <= pageContentDomRect.bottom;
        /**
         * mouseEvent가  pageContent의 아래 부분에서 일어났는지에 대한 객체, event가 아래 부분에서 일어났으면 true, 밖의 영역에서 일어났으면 false
         */
        const isInner = conditionX && conditionY;
        if (isInner) {
          const randomNumber = Math.floor(Math.random() * (100000 - 1) + 1);
          const newBlock: Block = {
            ...blockSample,
            id: `${page.id}_${JSON.stringify(Date.now)}_${randomNumber}`,
            firstBlock: true,
          };

          if (page.firstBlocksId) {
            page.blocks &&
              addBlock(page.id, newBlock, page.blocks.length, null);
          } else {
            addBlock(page.id, newBlock, 0, null);
          }
          setTemplateItem(templateHtml, page);
        }
      }
    },
    [addBlock, page, templateHtml]
  );

  return (
    <div className="page__contents" onClick={onClickPageContentBottom}>
      <div
        className="page__contents__inner"
        onMouseMove={makeMoveBlockTrue}
        onTouchMove={makeMoveBlockTrue}
      >
        {!newPageFrame ? (
          firstBlocks?.map((block: Block) => {
            return (
              <EditableBlock
                key={block.id}
                pages={pages}
                pagesId={pagesId}
                page={page}
                block={block}
                fontSize={fontSize}
                isMoved={isMoved}
                setMoveTargetBlock={setMoveTargetBlock}
                pointBlockToMoveBlock={pointBlockToMoveBlock}
                command={command}
                setCommand={setCommand}
                openComment={openComment}
                setOpenComment={setOpenComment}
                setCommentBlock={setCommentBlock}
                setOpenLoader={setOpenLoader}
                setLoaderTargetBlock={setLoaderTargetBlock}
                closeMenu={closeMenu}
                templateHtml={templateHtml}
                setSelection={setSelection}
                setMobileMenuTargetBlock={setMobileMenuTargetBlock}
                mobileMenuTargetBlock={mobileMenuTargetBlock}
              />
            );
          })
        ) : (
          <EmptyPageContent page={page} setOpenTemplates={setOpenTemplates} />
        )}
      </div>
    </div>
  );
};

export default PageContent;
