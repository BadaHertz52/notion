import React, { memo } from "react";
import Result, { resultType } from "./Result";
import { FixedSizeList, Layout } from "react-window";

type ResultListProps = {
  list: resultType[];
  listHeight: string | number;
  listWidth: number;
  layout: Layout;
  itemSize: number;
};
const ResultList = (props: ResultListProps) => {
  return (
    <FixedSizeList
      height={props.listHeight}
      width={props.listWidth}
      layout={props.layout}
      itemCount={props.list.length}
      itemData={props.list}
      itemKey={(index) => `result-list_${props.list[index].id}`}
      itemSize={props.itemSize}
    >
      {({ index }) => (
        <Result item={props.list[index]} width={props.listWidth} />
      )}
    </FixedSizeList>
  );
};

export default memo(ResultList);
