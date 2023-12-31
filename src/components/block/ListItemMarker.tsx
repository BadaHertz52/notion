import React from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { Block } from "../../types";

type ListItemMarkerProps = {
  subBlocks: Block[];
  subBlock: Block;
};
const ListItemMarker = ({ subBlocks, subBlock }: ListItemMarkerProps) => {
  const subBlocksId = subBlocks.map((v) => v.id);

  const getListMarker = (subBlock: Block) => {
    return subBlocksId ? subBlocksId.indexOf(subBlock.id) + 1 : 0;
  };

  return (
    <div className="listItem-marker">
      {subBlock.type.includes("number") ? (
        `${getListMarker(subBlock)}.`
      ) : (
        <GoPrimitiveDot />
      )}
    </div>
  );
};

export default React.memo(ListItemMarker);
