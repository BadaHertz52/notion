import { memo } from "react";
import { FixedSizeList, Layout } from "react-window";

import { Result, TrashResultItem } from "../index";

import { ResultType } from "../../types";

type ResultListProps = {
  list: ResultType[];
  listHeight: string | number;
  listWidth: number;
  layout: Layout;
  itemSize: number;
  isTrash?: boolean;
  closeTrash?: () => void;
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
        props.isTrash && props.closeTrash ? (
          <TrashResultItem
            item={props.list[index]}
            width={props.listWidth}
            closeTrash={props.closeTrash}
          />
        ) : (
          <Result item={props.list[index]} width={props.listWidth} />
        )
      }
    </FixedSizeList>
  );
};

export default memo(ResultList);
