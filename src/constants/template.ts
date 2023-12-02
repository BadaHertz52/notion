import { Block, Page } from "../types";
import { getBlockSample } from "../utils";
import { returnTemplateBlock, returnTemplateSubBlock } from "../utils/template";
import { BASIC_BLOCK_STYLE } from "./block";
import { EMOJI_ARRAY } from "./emoji";

const DAY = [
  "Mon",
  "1",
  "Ths",
  "2",
  "Wed",
  "3",
  "Thr",
  "4",
  "Fri",
  "5",
  "Sat",
  "6",
  "Sun",
];

const TEMPLATE_BLOCKS = DAY.map((d: string) => {
  let returnBlock: Block;
  if (DAY.indexOf(d) % 2 === 0) {
    returnBlock = returnTemplateBlock(d, DAY.indexOf(d));
  } else {
    returnBlock = {
      ...getBlockSample(),
      id: `empty${d}_${JSON.stringify(Date.now())}`,
    };
  }
  return returnBlock;
});

const TEMPLATE_BLOCKS_ID_ARRAY = TEMPLATE_BLOCKS.map(
  (block: Block) => block.id
);

const TEMPLATE_SUB_BLOCKS = DAY.map((d: string) =>
  returnTemplateSubBlock(d, DAY.indexOf(d))
);
const TEMPLATE_SUB_BLOCKS_ID_ARRAY = DAY.map((d: string) => `templateSub_${d}`);
//reducer
export const TEMPLATE1: Page = {
  id: "template1",
  type: "template",
  header: {
    title: "To Do List ",
    iconType: "emoji",
    icon: EMOJI_ARRAY[13],
    cover: null,
    comments: null,
  },
  firstBlocksId: TEMPLATE_BLOCKS_ID_ARRAY,
  blocks: [...TEMPLATE_BLOCKS, ...TEMPLATE_SUB_BLOCKS],
  blocksId: [...TEMPLATE_BLOCKS_ID_ARRAY, ...TEMPLATE_SUB_BLOCKS_ID_ARRAY],
  subPagesId: null,
  parentsId: null,
  editTime: Date.parse("2022-8-23-15:00").toString(),
  createTime: Date.parse("2022-8-23-12:00").toString(),
};
export const TEMPLATE2: Page = {
  id: "template2",
  type: "template",
  header: {
    title: "To Do List2 ",
    iconType: "emoji",
    icon: EMOJI_ARRAY[19],
    cover: null,
    comments: null,
  },
  firstBlocksId: ["template2_block1"],
  blocks: [
    {
      id: `template2_block1`,
      contents: "check meeting",
      firstBlock: true,
      subBlocksId: null,
      parentBlocksId: null,
      type: "todo",
      iconType: null,
      icon: null,
      editTime: JSON.stringify(Date.now()),
      createTime: JSON.stringify(Date.now()),
      style: BASIC_BLOCK_STYLE,
      comments: null,
    },
  ],
  blocksId: ["template2_block1"],
  subPagesId: null,
  parentsId: null,
  editTime: Date.parse("2022-8-23-15:00").toString(),
  createTime: Date.parse("2022-8-23-12:00").toString(),
};
