import React, { MouseEvent, TouchEvent } from "react";

import { CSSProperties } from "styled-components";
import { GoPrimitiveDot } from "react-icons/go";

import { BlockContentsProps } from "./BlockContents";
import { EditableBlockProps } from "./EditableBlock";
import {
  BlockContents,
  BlockComment,
  EditableBlock,
  MainBlock,
} from "../index";

import { Block } from "../../types";
import { findBlock } from "../../utils";
import { MainBlockProps } from "./MainBlock";

type ListSubProps = EditableBlockProps &
  MainBlockProps & {
    subBlocks?: Block[];
  };

const ListSub = ({ ...props }: ListSubProps) => {
  const { page, subBlocks } = props;

  return (
    <>
      {subBlocks &&
        subBlocks[0] &&
        subBlocks.map((subBlock: Block, i) => (
          <div
            className="listItem"
            id={`block-${subBlock.id}`}
            key={`listItem_${i}`}
          >
            <MainBlock {...props} block={subBlock} subBlocks={subBlocks} />
            {subBlock.subBlocksId && (
              <div className="subBlock-group">
                {subBlock.subBlocksId
                  .map((id: string) => findBlock(page, id).BLOCK)
                  .map((subSubBlock: Block, i) => (
                    <EditableBlock
                      {...props}
                      block={subSubBlock}
                      key={`${subBlock}_subBlock_${i}`}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
    </>
  );
};

export default React.memo(ListSub);
