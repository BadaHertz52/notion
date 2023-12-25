import React, {
  Dispatch,
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

import { ActionContext, ModalContext } from "../../contexts";
import { Block, Page } from "../../types";
import {
  setOriginTemplateItem,
  getBlockSample,
  getNewBlockId,
} from "../../utils";

export type FrameInnerProps = PageHeaderProps & {
  firstBlocks: Block[] | null;
  newPageFrame: boolean;
  pages: Page[];
  pagesId: string[];
  page: Page;
  fontSize: number;
  frameRef: RefObject<HTMLDivElement>;
  setMovingTargetBlock: Dispatch<SetStateAction<Block | null>>;
  frameInnerStyle: CSSProperties;
  closeModal: () => void;
  openTemplates?: () => void;
};

const FrameInner = (props: FrameInnerProps) => {
  const { page, firstBlocks, frameRef } = props;
  const { addBlock } = useContext(ActionContext).actions;
  const { changeModalState } = useContext(ModalContext);

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

  const onClickCommentBtn = useCallback(
    (block: Block) => {
      changeModalState({
        open: true,
        target: "comments",
        block: block,
      });
    },
    [changeModalState]
  );

  const onClickBottom = useCallback(() => {
    const middleNumber: number = page.blocksId?.length || 0;
    const newBlock: Block = {
      ...getBlockSample(),
      id: getNewBlockId(page.id, middleNumber),
      firstBlock: true,
    };

    if (page.firstBlocksId) {
      page.blocks && addBlock(page.id, newBlock, page.blocks.length, null);
    } else {
      addBlock(page.id, newBlock, 0, null);
    }
    setOriginTemplateItem(page);
  }, [addBlock, page]);

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
      <PageHeader {...props} />
      <div className="page__contents">
        {firstBlocks?.map((block, i) => (
          <div
            className="page__firstBlock"
            key={`${page.id}_firstBlock_${block.id}`}
          >
            <EditableBlock
              {...props}
              key={`page__firstBlocks__${block.id}`}
              block={block}
              onClickCommentBtn={onClickCommentBtn}
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
          props.openTemplates && (
            <EmptyPageContent
              page={props.page}
              openTemplates={props.openTemplates}
            />
          )
        )}
      </div>
    </div>
  );
};

export default memo(FrameInner);
