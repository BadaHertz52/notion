import React, {
  Dispatch,
  MouseEvent,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  RefObject,
  memo,
  useLayoutEffect,
  useRef,
} from "react";
import { Block, Page } from "../modules/notion/type";
import { Command } from "./Frame";
import { SelectionType } from "../route/NotionRouter";
import EditableBlock from "./EditableBlock";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps,
} from "react-virtualized";
export type PageContent_BlockList_Props = {
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
};
type BlockListProps = PageContent_BlockList_Props & {
  firstBlocks: Block[];
};
const BlockList = (props: BlockListProps) => {
  const [height, setHeight] = useState<number>(window.innerHeight - 45);
  const blockListRef = useRef<HTMLDivElement>(null);
  type RowProps = {
    index: number;
    measure?: () => void;
  };
  const Row = ({ index, measure }: RowProps) => {
    const block = props.firstBlocks[index];
    return (
      <EditableBlock
        key={block.id}
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
        measure={measure}
      />
    );
  };
  const contentsInnerEl = document.querySelector(".page__contents__inner");
  const cache = new CellMeasurerCache({
    defaultWidth: contentsInnerEl?.clientWidth,
    fixedWidth: true,
  });
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
  return (
    <div ref={blockListRef}>
      <AutoSizer disableHeight={false} style={{ height: height }}>
        {({ width, height }) => (
          <List
            height={height}
            width={width}
            overscanRowCount={0}
            rowCount={props.firstBlocks.length}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderer}
            deferredMeasurementCache={cache}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default memo(BlockList);
