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

import { ActionContext, ModalContext } from "../../contexts";
import { Block, Page, CommandType, SelectionType } from "../../types";
import { setTemplateItem, getBlockSample, getNewBlockId } from "../../utils";

export type FrameInnerProps = PageHeaderProps & {
  openExport?: boolean;
  firstBlocks: Block[] | null;
  newPageFrame: boolean;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
  pages: Page[];
  pagesId: string[];
  page: Page;
  fontSize: number;
  frameRef: RefObject<HTMLDivElement>;
  templateHtml: HTMLElement | null;
  isMoved: MutableRefObject<boolean>;
  pointBlockToMoveBlock: MutableRefObject<Block | null>;
  setMovingTargetBlock: Dispatch<SetStateAction<Block | null>>;
  command: CommandType;
  setCommand: Dispatch<SetStateAction<CommandType>>;
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
  closeModal: () => void;
};

const FrameInner = (props: FrameInnerProps) => {
  const { page, firstBlocks, frameRef, templateHtml } = props;
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
