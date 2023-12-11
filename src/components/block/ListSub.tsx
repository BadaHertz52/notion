import React, { MouseEvent, TouchEvent, useRef } from "react";

import { CSSProperties } from "styled-components";
import { GoPrimitiveDot } from "react-icons/go";

import { BlockComponentProps } from "./BlockContents";
import { EditableBlockProps } from "./EditableBlock";
import { BlockContents, BlockComment, EditableBlock } from "../index";

import { Block } from "../../types";
import { findBlock, getBlockContentsStyle } from "../../utils";

type ListSubProps = EditableBlockProps &
  BlockComponentProps & {
    subBlocks?: Block[];
    isOpenComments: boolean;
    markPointBlock: (
      event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
      targetBlock: Block
    ) => void;
    cancelPointBlock: (event: MouseEvent<HTMLDivElement>) => void;
  };

const ListSub = ({ ...props }: ListSubProps) => {
  const { block, page, subBlocks } = props;

  const blockContentsRef = useRef<HTMLDivElement>(null);
  const getListMarker = (subBlock: Block) => {
    let listMarker: string = "";
    const listSubBlocksId = block.subBlocksId;

    if (listSubBlocksId) {
      const listSubBlocks = listSubBlocksId.map(
        (id: string) => findBlock(page, id).BLOCK
      );
      // const alphabetArr = Array.from({ length: 26 }, (v, i) => String.fromCharCode(i + 65));
      const numberArr = Array.from({ length: 9 }, (v, i) => i + 1);
      const subBlockIndex = listSubBlocksId.indexOf(subBlock.id) as number;
      if (subBlockIndex === 0) {
        listMarker = "1";
      } else {
        const previousSubBlock = listSubBlocks[subBlockIndex - 1];
        if (previousSubBlock.type === "numberList") {
          const slicedSubBlocks = listSubBlocks.slice(0, subBlockIndex); // 0~ previous block 까지
          const filteredSubBlocks = slicedSubBlocks.filter(
            (block: Block) => (block.type = "numberList")
          );
          listMarker = numberArr[filteredSubBlocks.length].toString();
        } else {
          listMarker = "1";
        }
      }
    }
    return listMarker;
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
        subBlocks.map((block: Block, i) => (
          <div className="listItem" key={`listItem_${i}`}>
            <div
              className="mainBlock"
              key={`listItem_${subBlocks.indexOf(block)}`}
              onMouseOver={(event) => props.markPointBlock(event, block)}
              onMouseLeave={(event) => props.cancelPointBlock(event)}
            >
              <div className="mainBlock__block">
                <div
                  id={`block-${block.id}`}
                  className="block__contents"
                  ref={blockContentsRef}
                  style={getListStyle(block)}
                >
                  {block.type.includes("List") && (
                    <div className="listItem-marker">
                      {block.type.includes("number") ? (
                        `${getListMarker(block)}.`
                      ) : (
                        <GoPrimitiveDot />
                      )}
                    </div>
                  )}
                  <BlockContents {...props} />
                </div>
              </div>
              {props.isOpenComments && (
                <BlockComment
                  block={block}
                  onClickCommentBtn={props.onClickCommentBtn}
                />
              )}
            </div>
            {block.subBlocksId && (
              <div className="subBlock-group">
                {block.subBlocksId
                  .map((id: string) => findBlock(page, id).BLOCK)
                  .map((sub: Block) => (
                    <EditableBlock
                      {...props}
                      key={block.subBlocksId?.indexOf(sub.id)}
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
