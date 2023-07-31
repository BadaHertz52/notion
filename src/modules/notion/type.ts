import {
  bg_blue,
  bg_default,
  bg_green,
  bg_grey,
  bg_pink,
  bg_yellow,
  blue,
  defaultColor,
  green,
  grey,
  orange,
  red,
} from "./colorData";
import { Emoji } from "./emojiData";

type BlockType =
  | "text"
  | "toggle"
  | "todo"
  | "todo_done"
  | "image"
  | "h1"
  | "h2"
  | "h3"
  | "page"
  | "numberList"
  | "bulletList"
  | "numberListArr"
  | "bulletListArr";

type ColorType =
  | typeof defaultColor
  | typeof grey
  | typeof orange
  | typeof green
  | typeof blue
  | typeof red;
type BgColorType =
  | typeof bg_default
  | typeof bg_grey
  | typeof bg_yellow
  | typeof bg_green
  | typeof bg_blue
  | typeof bg_pink;

type BlockStyle = {
  color: ColorType;
  bgColor: BgColorType;
  width: undefined | string;
  height: undefined | string;
};

type IconType = "img" | "emoji" | null;
type SubCommentType = {
  id: string;
  userName: string;
  content: string;
  editTime: string;
  createTime: string;
};
type CommentType = "open" | "resolve";
type MainCommentType = SubCommentType & {
  type: CommentType;
  selectedText: null | string;
  subComments: SubCommentType[] | null;
  subCommentsId: string[] | null;
};
type Block = {
  /** 새로 만들어진 block.id 는 `${page.id}_${page.blocks.length}_${editTime}` 형식 */
  id: string;
  contents: string;
  firstBlock: boolean;
  subBlocksId: string[] | null;
  parentBlocksId: string[] | null;
  type: BlockType;
  iconType: IconType;
  icon: string | Emoji | null;
  editTime: string;
  createTime: string;
  style: BlockStyle;
  comments: MainCommentType[] | null;
};

/**
 * path,page list 등 page의 block date를 제외한 page에 대한 간략한 정보를 담은 type
 */
type ListItem = {
  id: string;
  title: string;
  iconType: IconType;
  icon: string | Emoji | null;
  subPagesId: string[] | null;
  parentsId: string[] | null;
  editTime: string;
  createTime: string;
};

type PageType = "page" | "template";
export type PageHeader = {
  title: string;
  iconType: IconType;
  icon: string | Emoji | null;
  cover: string | null;
  comments: MainCommentType[] | null;
};
type Page = {
  /**
   * "/" 사용 x , 만들어진 시간을 활용
   */
  id: string;
  type: PageType;
  header: PageHeader;
  firstBlocksId: string[] | null;
  blocks: Block[] | null;
  blocksId: string[] | null;
  subPagesId: string[] | null;
  parentsId: string[] | null;
  editTime: string;
  createTime: string;
};
/**
 * 삭제된 page가 보여있는 trash에서의 page type
 */
type TrashPage = Page & {
  subPages: Page[] | null;
};

type Notion = {
  pagesId: string[] | null;
  firstPagesId: string[] | null;
  templatesId: string[] | null;
  pages: Page[] | null;
  trash: {
    pagesId: string[] | null;
    pages: TrashPage[] | null;
  };
};

export {
  Notion,
  TrashPage,
  Page,
  ListItem,
  Block,
  MainCommentType,
  SubCommentType,
  CommentType,
  IconType,
  BlockStyle,
  BgColorType,
  ColorType,
  BlockType,
  Emoji,
};
