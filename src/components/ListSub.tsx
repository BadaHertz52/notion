import React, { MouseEvent, TouchEvent, useRef } from "react";
import { Block } from "../modules/notion/type";
import { findBlock } from "../fn";
import { CSSProperties } from "styled-components";
import { GoPrimitiveDot } from "react-icons/go";
import BlockComponent, { BlockComponentProps } from "./BlockComponent";
import BlockComment from "./BlockComment";
import EditableBlock, { EditableBlockProps } from "./EditableBlock";

type ListSubProps = EditableBlockProps &
  BlockComponentProps & {
    subBlocks?: Block[];
    showBlockComment: boolean;
    markPointBlock: (
      event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
      targetBlock: Block
    ) => void;
    cancelPointBlock: (event: MouseEvent<HTMLDivElement>) => void;
  };
const ListSub = ({
  pages,
  pagesId,
  page,
  block,
  fontSize,
  isMoved,
  setMoveTargetBlock,
  pointBlockToMoveBlock,
  command,
  setCommand,
  openComment,
  setOpenComment,
  setCommentBlock,
  setOpenLoader,
  setLoaderTargetBlock,
  closeMenu,
  templateHtml,
  setSelection,
  setMobileMenuTargetBlock,
  mobileMenuTargetBlock,
  onClickCommentBtn,
  subBlocks,
  showBlockComment,
  markPointBlock,
  cancelPointBlock,
  measure,
}: ListSubProps) => {
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
  const listStyle = (block: Block): CSSProperties => {
    return {
      textDecoration: "none",
      fontStyle: "normal",
      fontWeight: "normal",
      backgroundColor: block.style.bgColor,
      color: block.style.color,
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
              onMouseOver={(event) => markPointBlock(event, block)}
              onMouseLeave={(event) => cancelPointBlock(event)}
            >
              <div className="mainBlock__block">
                <div
                  id={`block-${block.id}`}
                  className="block__contents"
                  ref={blockContentsRef}
                  style={listStyle(block)}
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
                  <BlockComponent
                    block={block}
                    page={page}
                    pages={pages}
                    pagesId={pagesId}
                    command={command}
                    setCommand={setCommand}
                    setOpenComment={setOpenComment}
                    setOpenLoader={setOpenLoader}
                    setLoaderTargetBlock={setLoaderTargetBlock}
                    closeMenu={closeMenu}
                    templateHtml={templateHtml}
                    setSelection={setSelection}
                    setMobileMenuTargetBlock={setMobileMenuTargetBlock}
                    onClickCommentBtn={onClickCommentBtn}
                    isMoved={isMoved}
                    setMoveTargetBlock={setMoveTargetBlock}
                    measure={measure}
                  />
                </div>
              </div>
              {showBlockComment && (
                <BlockComment
                  block={block}
                  onClickCommentBtn={onClickCommentBtn}
                />
              )}
            </div>
            {block.subBlocksId && (
              <div className="subBlock-group">
                {block.subBlocksId
                  .map((id: string) => findBlock(page, id).BLOCK)
                  .map((sub: Block) => (
                    <EditableBlock
                      key={block.subBlocksId?.indexOf(sub.id)}
                      pages={pages}
                      pagesId={pagesId}
                      page={page}
                      block={sub}
                      fontSize={fontSize}
                      isMoved={isMoved}
                      setMoveTargetBlock={setMoveTargetBlock}
                      pointBlockToMoveBlock={pointBlockToMoveBlock}
                      command={command}
                      setCommand={setCommand}
                      openComment={openComment}
                      setOpenComment={setOpenComment}
                      setCommentBlock={setCommentBlock}
                      setOpenLoader={setOpenLoader}
                      setLoaderTargetBlock={setLoaderTargetBlock}
                      closeMenu={closeMenu}
                      templateHtml={templateHtml}
                      setSelection={setSelection}
                      setMobileMenuTargetBlock={setMobileMenuTargetBlock}
                      mobileMenuTargetBlock={mobileMenuTargetBlock}
                      measure={measure}
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
