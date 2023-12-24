import React, { MouseEvent, TouchEvent } from "react";

import { CSSProperties } from "styled-components";
import { GoPrimitiveDot } from "react-icons/go";

import { BlockContentsProps } from "./BlockContents";
import { EditableBlockProps } from "./EditableBlock";
import { BlockContents, BlockComment, EditableBlock } from "../index";

import { Block } from "../../types";
import { findBlock, getBlockContentsStyle } from "../../utils";

type ListSubProps = EditableBlockProps &
  BlockContentsProps & {
    subBlocks?: Block[];
    isOpenComments: boolean;
    markPointBlock: (
      event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
    ) => void;
    cancelPointBlock: (event: MouseEvent<HTMLDivElement>) => void;
  };

const ListSub = ({ ...props }: ListSubProps) => {
  const { page, subBlocks } = props;

  const subBlocksId = subBlocks?.map((v) => v.id);

  const getListMarker = (subBlock: Block) => {
    return subBlocksId ? subBlocksId.indexOf(subBlock.id) + 1 : 0;
  };

  const getListStyle = (block: Block): CSSProperties => {
    const blockContentStyle = getBlockContentsStyle(block);
    return {
      ...blockContentStyle,
      textDecoration: "none",
      fontStyle: "normal",
      fontWeight: "normal",
    };
  };

  return (
    <>
      {subBlocks &&
        subBlocks[0] &&
        subBlocks.map((subBlock: Block, i) => (
          <div className="listItem" key={`listItem_${i}`}>
            <div
              className="mainBlock"
              key={`listItem_${i}`}
              onMouseOver={props.markPointBlock}
              onMouseLeave={props.cancelPointBlock}
            >
              <div className="mainBlock__block">
                <div
                  id={`block-${subBlock.id}`}
                  className="block__contents"
                  style={getListStyle(subBlock)}
                >
                  {subBlock.type.includes("List") && (
                    <div className="listItem-marker">
                      {subBlock.type.includes("number") ? (
                        `${getListMarker(subBlock)}.`
                      ) : (
                        <GoPrimitiveDot />
                      )}
                    </div>
                  )}
                  <BlockContents {...props} block={subBlock} />
                </div>
              </div>
              {props.isOpenComments && props.onClickCommentBtn && (
                <BlockComment
                  block={subBlock}
                  onClickCommentBtn={props.onClickCommentBtn}
                />
              )}
            </div>
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
