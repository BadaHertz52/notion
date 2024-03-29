import { CSSProperties } from "styled-components";
import { BASIC_BLOCK_STYLE } from "../constants/block";
import { Block, BlockType, Page } from "../types";
import { BACKGROUND_COLOR, COLOR } from "../constants";
import { getEditTime } from "./time";

export function getBlockSample(): Block {
  const editTime = JSON.stringify(Date.now());
  return {
    id: `blockSample_${editTime}`,
    contents: "",
    firstBlock: true,
    subBlocksId: null,
    parentBlocksId: null,
    type: "text",
    iconType: null,
    icon: null,
    editTime: editTime,
    createTime: editTime,
    style: BASIC_BLOCK_STYLE,
    comments: null,
  };
}
export const getNewBlockId = (
  pageId: string,
  middleNumber: string | number,
  blockType?: BlockType
) =>
  `${
    blockType === "page" ? "page" : "block"
  }_${pageId}_${middleNumber}_${getEditTime()}`;
/**
 * 특정 블록의 동렬로 그 다음 순위인 새로운 블록을 생성해 반환하는 함수
 * @param page  새로운 블록이 입력될 page
 * @param targetBlock  새로운 블록의 기준이 될 블록 (새로운 블록은 targetBlock의 firstBlock, subBlocksId, parentBlocksId의 값을 가짐 )
 * @param newBlockContents 새로운 블록의 contents 값, 새로운 블록의 입력값이 없으면 undefined
 * @returns 새로운 블록
 */
export const makeNewBlock = (
  page: Page,
  targetBlock: Block | null,
  newBlockContents?: string
): Block => {
  const editTime = JSON.stringify(Date.now());
  const blockNumber = !page.blocks ? 0 : page.blocks.length;
  const blockType = targetBlock ? targetBlock.type : "text";
  const newBlock: Block = {
    id: getNewBlockId(page.id, blockNumber, blockType),
    editTime: editTime,
    createTime: editTime,
    type: blockType,
    contents:
      newBlockContents === "<br>" || !newBlockContents ? "" : newBlockContents,
    firstBlock: targetBlock ? targetBlock.firstBlock : true,
    subBlocksId: targetBlock ? targetBlock.subBlocksId : null,
    parentBlocksId: targetBlock ? targetBlock.parentBlocksId : null,
    iconType: null,
    icon: null,
    style: BASIC_BLOCK_STYLE,
    comments: null,
  };
  return newBlock;
};

/**
 *  block content에 있는 스타일 코드와 링크를 제외하고 글자 그대로를 반환하는 함수
 * @param block
 * @returns
 */
export const getBlockText = (block: Block) => {
  const contentEditableHtml = document.getElementById(
    `${block.id}__contents`
  )?.firstElementChild;
  let text = "";
  if (contentEditableHtml) {
    const children = [...contentEditableHtml.childNodes];
    let contentsArr: string[] = [];
    children.forEach((c: Node) => {
      if (c.nodeType === 3) {
        c.nodeValue && contentsArr.push(c.nodeValue);
      }
      if (c.nodeType === 1) {
        const element = c as HTMLElement;
        contentsArr.push(element.innerText);
      }
    });
    text = contentsArr.join("");
  }
  return text;
};
/**
 * block.id로 block을 찾을 수 있는 함수
 * @param page 찾을 block이 존재하는 페이지
 * @param blockId 찾을 block의 아이디
 * @returns index: block의 page.blocks에서의 index, BLOCK: 찾는 block
 */
export function findBlock(
  page: Page,
  blockId: string
): { index: number; BLOCK: Block } {
  let index = 0;
  let block = getBlockSample();
  if (page.blocks && page.blocksId) {
    index = page.blocksId.indexOf(blockId);
    block = page.blocks[index];
  } else {
    console.error(
      `page(id:${page.id}, title:${page.header.title}) doesn't have blocks`
    );
  }

  return {
    index: index,
    BLOCK: block,
  };
}
/**
 * subBlock 의 바로 윗대의 parentBlock를 찾는 함수
 * @param page subBlock이 존재하는 page
 * @param subBlock  parentBlock을 찾는데 기준이 되는 subBlock
 * @returns parentBlockIndex: parentBlock의 page.blocks에서의 index, parentBloc: 찾고자 한 parentBlock
 */
export const findParentBlock = (
  page: Page,
  subBlock: Block
): { parentBlockIndex: number; parentBlock: Block } => {
  const parentBlocksId = subBlock.parentBlocksId as string[];
  const last: number = parentBlocksId.length - 1;
  const parentBlockId = parentBlocksId[last];
  const { index, BLOCK } = findBlock(page, parentBlockId);
  return {
    parentBlockIndex: index,
    parentBlock: BLOCK,
  };
};

/**
 * 페이지 상의 block(=@param block)의 앞에 있는 block(=previousBlockInDoc)를 찾는 함수
 * @param page 현재 페이지
 * @param block  previousBlock의 기준이 되는 block
 * @returns  block의 앞에 있는 previousBlock과 previousBlockIndex(=page.blocksId.indexOf(previousBlock.id))
 */
export const findPreviousBlockInDoc = (
  page: Page,
  block: Block
): { previousBlockInDoc: Block; previousBlockInDocIndex: number } => {
  let previousBlockInDoc = getBlockSample();
  let previousBlockIndex = 0;
  const findLastSubBLOCK = (targetBlock: Block) => {
    if (targetBlock.subBlocksId) {
      const lastSubBlockId =
        targetBlock.subBlocksId[targetBlock.subBlocksId.length - 1];
      const { BLOCK, index } = findBlock(page, lastSubBlockId);
      if (BLOCK.subBlocksId === null) {
        previousBlockInDoc = BLOCK;
        previousBlockIndex = index;
      } else {
        findLastSubBLOCK(BLOCK);
      }
    }
  };
  if (page.firstBlocksId) {
    if (block.firstBlock) {
      const blockIndexAsFirstBlock = page.firstBlocksId.indexOf(block.id);
      const previousFirstBlockId =
        page.firstBlocksId[blockIndexAsFirstBlock - 1];
      const { BLOCK, index } = findBlock(page, previousFirstBlockId);
      const previousFirstBlock = BLOCK;
      const previousFirstBlockIndex = index;
      if (previousFirstBlock.subBlocksId === null) {
        previousBlockInDoc = previousFirstBlock;
        previousBlockIndex = previousFirstBlockIndex;
      } else {
        findLastSubBLOCK(previousFirstBlock);
      }
    }
    if (!block.firstBlock) {
      const { parentBlock, parentBlockIndex } = findParentBlock(page, block);
      if (parentBlock.subBlocksId) {
        const blockIndexAsSubBlock = parentBlock.subBlocksId.indexOf(block.id);
        if (blockIndexAsSubBlock === 0) {
          previousBlockInDoc = parentBlock;
          previousBlockIndex = parentBlockIndex;
        } else {
          const previousSubBlockId =
            parentBlock.subBlocksId[blockIndexAsSubBlock - 1];
          const { BLOCK, index } = findBlock(page, previousSubBlockId);
          const previousSubBlock = BLOCK;
          if (previousSubBlock.subBlocksId === null) {
            previousBlockInDoc = previousSubBlock;
            previousBlockIndex = index;
          } else {
            findLastSubBLOCK(previousSubBlock);
          }
        }
      }
    }
  }
  return {
    previousBlockInDoc: previousBlockInDoc,
    previousBlockInDocIndex: previousBlockIndex,
  };
};

export const getBlockContentsStyle = (block: Block): CSSProperties => {
  const { color, bgColor } = block.style;
  return {
    color: block.type !== "todo_done" ? COLOR[color] : "rgb(60, 60, 60)",
    backgroundColor: BACKGROUND_COLOR[bgColor],
    width:
      block.style.width === undefined
        ? block.type === "image"
          ? block.contents === ""
            ? "100%"
            : "auto"
          : "inherit"
        : block.style.width,
    height:
      block.style.height === undefined
        ? block.type === "image" && block.contents !== ""
          ? "150px"
          : "inherit"
        : block.style.height,
  };
};

export const getBlockDomRect = (block: Block) => {
  const blockEl = document.getElementById(`${block.id}__contents`);
  return blockEl?.getClientRects()[0];
};
