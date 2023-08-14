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
  TouchEvent,
} from "react";
import PageHeader, { PageHeaderProps } from "./PageHeader";
import { Block, Page } from "../modules/notion/type";
import EditableBlock from "./EditableBlock";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps,
  WindowScroller,
} from "react-virtualized";
import { blockSample } from "../modules/notion/reducer";
import { setTemplateItem } from "../fn";
import { ActionContext, SelectionType } from "../route/NotionRouter";
import EmptyPageContent from "./EmptyPageContent";
import { Command } from "./Frame";
import { CSSProperties } from "styled-components";

type FrameInnerProps = PageHeaderProps & {
  isExport?: boolean;
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
  move_MoveTargetBlock: (clientX: number, clientY: number) => void;
  stopMovingBlock: () => void;
  move_MoveTargetBlockInMobile: (event: TouchEvent<HTMLDivElement>) => void;
  frameInnerStyle: CSSProperties;
};
const FrameInner = (props: FrameInnerProps) => {
  const { page, firstBlocks, frameRef, templateHtml } = props;
  const { addBlock } = useContext(ActionContext).actions;
  const bottomHeight = 80;

  const list: (Page | Block | undefined)[] = firstBlocks
    ? [page, ...firstBlocks, undefined]
    : [page];

  type RowProps = {
    index: number;
    measure: () => void;
  };
  const cache = new CellMeasurerCache({
    defaultWidth: frameRef.current?.clientWidth,
    fixedWidth: true,
  });

  const changeScrollStyle = useCallback(() => {
    const el = frameRef.current?.querySelector(
      ".ReactVirtualized__Grid__innerScrollContainer"
    ) as HTMLElement;
    el.setAttribute(
      "style",
      "width:100%; height:auto; max-height:initial; max-width:initial; position:relative;"
    );
  }, [frameRef]);

  const Row = ({ index, measure }: RowProps) => {
    const item: Page | Block =
      index === 0 ? (list[index] as Page) : (list[index] as Block);
    return index === 0 ? (
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
        handleImgLoad={measure}
        frameInnerStyle={props.frameInnerStyle}
      />
    ) : list[index] ? (
      <div className="page__firstBlock" style={props.frameInnerStyle}>
        <EditableBlock
          key={(item as Block).id}
          pages={props.pages}
          pagesId={props.pagesId}
          page={props.page}
          block={item as Block}
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
          measure={measure}
        />
      </div>
    ) : (
      <div
        className="bottom"
        onClick={onClickBottom}
        style={{ height: bottomHeight }}
      ></div>
    );
  };

  const rowRenderer = (rowRenderProps: ListRowProps) => {
    const { parent, key, index } = rowRenderProps;
    return (
      <CellMeasurer
        cache={cache}
        parent={parent}
        key={key}
        columnIndex={0}
        rowIndex={index}
      >
        {({ measure }) => <Row index={index} measure={measure} />}
      </CellMeasurer>
    );
  };
  const onClickBottom = useCallback(() => {
    const randomNumber = Math.floor(Math.random() * (100000 - 1) + 1);
    const newBlock: Block = {
      ...blockSample,
      id: `${page.id}_${JSON.stringify(Date.now)}_${randomNumber}`,
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
      onMouseMove={(event) =>
        props.move_MoveTargetBlock(event.clientX, event.clientY)
      }
      onMouseUp={props.stopMovingBlock}
      onTouchMove={(event) => props.move_MoveTargetBlockInMobile(event)}
      onTouchEnd={props.stopMovingBlock}
    >
      <WindowScroller
        scrollElement={
          frameRef.current ? (frameRef.current as HTMLElement) : undefined
        }
      >
        {({ height }) => (
          <AutoSizer>
            {({ width }) => (
              <List
                height={height}
                width={width}
                overscanRowCount={0}
                rowCount={list.length}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                deferredMeasurementCache={cache}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>

      {props.newPageFrame && (
        <EmptyPageContent
          page={props.page}
          setOpenTemplates={props.setOpenTemplates}
        />
      )}
    </div>
  );
};

export default memo(FrameInner);
