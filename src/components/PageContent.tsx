import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useContext,
  useRef,
} from "react";
import { Block, Page } from "../modules/notion/type";
import { blockSample } from "../modules/notion/reducer";
import { ActionContext } from "../route/NotionRouter";
import { setTemplateItem } from "../fn";
import EmptyPageContent from "./EmptyPageContent";
import BlockList, { PageContent_BlockList_Props } from "./BlockList";

export type PageContentProps = PageContent_BlockList_Props & {
  page: Page;
  newPageFrame: boolean;
  firstBlocks: Block[] | null;
  makeMoveBlockTrue: () => void;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
};
const PageContent = (props: PageContentProps) => {
  const { addBlock } = useContext(ActionContext).actions;
  const { page, templateHtml } = props;
  const contentInnerRef = useRef<HTMLDivElement>(null);
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
        onMouseMove={props.makeMoveBlockTrue}
        onTouchMove={props.makeMoveBlockTrue}
        ref={contentInnerRef}
      >
        {!props.newPageFrame ? (
          props.firstBlocks && (
            <BlockList
              pages={props.pages}
              pagesId={props.pagesId}
              page={props.page}
              firstBlocks={props.firstBlocks}
              frameRef={props.frameRef}
              fontSize={props.fontSize}
              isMoved={props.isMoved}
              setMoveTargetBlock={props.setMoveTargetBlock}
              pointBlockToMoveBlock={props.pointBlockToMoveBlock}
              command={props.command}
              setCommand={props.setCommand}
              openComment={props.openComment}
              setOpenComment={props.setOpenComment}
              setCommentBlock={props.setCommentBlock}
              setOpenLoader={props.setOpenLoader}
              setLoaderTargetBlock={props.setLoaderTargetBlock}
              closeMenu={props.closeMenu}
              templateHtml={props.templateHtml}
              setSelection={props.setSelection}
              setMobileMenuTargetBlock={props.setMobileMenuTargetBlock}
              mobileMenuTargetBlock={props.mobileMenuTargetBlock}
            />
          )
        ) : (
          <EmptyPageContent
            page={props.page}
            setOpenTemplates={props.setOpenTemplates}
          />
        )}
      </div>
    </div>
  );
};

export default PageContent;
