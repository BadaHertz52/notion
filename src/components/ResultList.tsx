import React, { Dispatch, SetStateAction, memo } from "react";
import Result, { resultType } from "./Result";
import { FixedSizeList, Layout } from "react-window";
import TrashResultItem from "./TrashResultItem";

type ResultListProps = {
  list: resultType[];
  listHeight: string | number;
  listWidth: number;
  layout: Layout;
  itemSize: number;
  isTrash?: boolean;
  setOpenTrash?: Dispatch<SetStateAction<boolean>>;
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
      {({ index }) =>
        props.isTrash && props.setOpenTrash ? (
          <TrashResultItem
            item={props.list[index]}
            width={props.listWidth}
            setOpenTrash={props.setOpenTrash}
          />
        ) : (
          <Result item={props.list[index]} width={props.listWidth} />
        )
      }
    </FixedSizeList>
  );
};

export default memo(ResultList);
