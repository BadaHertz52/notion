import React, {
  Dispatch,
  MouseEvent,
  MutableRefObject,
  RefObject,
  SetStateAction,
  memo,
  useCallback,
  useContext,
  useEffect,
} from "react";

import { CSSProperties } from "styled-components";

import { PageHeaderProps } from "../page/PageHeader";
import { EditableBlock, PageHeader, EmptyPageContent } from "../index";

import { ActionContext } from "../../contexts";
import { Block, Page, Command, SelectionType } from "../../types";
import { setTemplateItem, getBlockSample } from "../../utils";

export type FrameInnerProps = PageHeaderProps & {
  openExport?: boolean;
  firstBlocks: Block[] | null;
  newPageFrame: boolean;
  makeMoveBlockTrue: () => void;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
  pages: Page[];
  pagesId: string[];
  page: Page;
  fontSize: number;
  frameRef: RefObject<HTMLDivElement>;
  templateHtml: HTMLElement | null;
  isMoved: MutableRefObject<boolean>;
  pointBlockToMoveBlock: MutableRefObject<Block | null>;
  setMoveTargetBlock: Dispatch<SetStateAction<Block | null>>;
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
  frameInnerStyle: CSSProperties;
};

const FrameInner = (props: FrameInnerProps) => {
  const { page, firstBlocks, frameRef, templateHtml } = props;
  const { addBlock } = useContext(ActionContext).actions;
  const bottomHeight = 80;

  const changeScrollStyle = useCallback(() => {
    const listEl = frameRef?.current?.querySelector(
      ".ReactVirtualized__Grid ReactVirtualized__List"
    ) as HTMLElement | null | undefined;
    if (listEl?.style) listEl.style.overflow = "hidden";
    const scrollEl = frameRef.current?.querySelector(
      ".ReactVirtualized__Grid__innerScrollContainer"
    ) as HTMLElement;
    scrollEl.setAttribute(
      "style",
      "width:100%; height:auto; max-height:initial; max-width:initial; position:relative;"
    );
  }, [frameRef]);

  const onClickBottom = useCallback(() => {
    const randomNumber = Math.floor(Math.random() * (100000 - 1) + 1);
    const newBlock: Block = {
      ...getBlockSample(),
      id: `block_${page.id}_${JSON.stringify(Date.now())}_${randomNumber}`,
      firstBlock: true,
    };

    if (page.firstBlocksId) {
      page.blocks && addBlock(page.id, newBlock, page.blocks.length, null);
    } else {
      addBlock(page.id, newBlock, 0, null);
    }
    setTemplateItem(templateHtml, page);
  }, [addBlock, page, templateHtml]);

  useEffect(() => {
    const scrollContainerEl = frameRef.current?.querySelector(
      ".ReactVirtualized__Grid__innerScrollContainer"
    );
    if (!scrollContainerEl) {
      const time = setInterval(() => {
        const el = frameRef.current?.querySelector(
          ".ReactVirtualized__Grid__innerScrollContainer"
        ) as HTMLElement | undefined | null;
        if (el) {
          changeScrollStyle();
          clearInterval(time);
        }
      }, 1000);
    }
    window.addEventListener("scroll", changeScrollStyle);
    return window.removeEventListener("scroll", changeScrollStyle);
  }, [changeScrollStyle, frameRef]);

  return (
    <div
      className="frame__inner"
      id={`page-${page.id}`}
      style={{
        ...props.frameInnerStyle,
        overflowY: props.openExport ? "scroll" : "initial",
      }}
    >
      <PageHeader
        userName={props.userName}
        page={props.page}
        frameRef={props.frameRef}
        fontSize={props.fontSize}
        openTemplates={props.openTemplates}
        templateHtml={props.templateHtml}
        discardEdit={props.discardEdit}
        setDiscardEdit={props.setDiscardEdit}
        showAllComments={props.showAllComments}
        newPageFrame={props.newPageFrame}
        openExport={props.openExport}
      />
      <div className="page__contents">
        {firstBlocks?.map((block, i) => (
          <div
            className="page__firstBlock"
            key={`${page.id}_firstBlock_${block.id}`}
          >
            <EditableBlock
              key={`page__firstBlocks__${block.id}`}
              pages={props.pages}
              pagesId={props.pagesId}
              page={props.page}
              block={block}
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
              openExport={props.openExport}
            />
          </div>
        ))}
        {!props.newPageFrame ? (
          <div
            className="bottom"
            onClick={onClickBottom}
            style={{ height: bottomHeight }}
          ></div>
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

export default memo(FrameInner);
