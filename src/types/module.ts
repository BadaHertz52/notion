import { COLOR, BACKGROUND_COLOR, EMOJI_DATA } from "../constants";

export type Emoji = keyof typeof EMOJI_DATA;

export type BlockType =
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

export type ColorType = keyof typeof COLOR;

export type BgColorType = keyof typeof BACKGROUND_COLOR;

export type BlockStyle = {
  color: ColorType;
  bgColor: BgColorType;
  width: undefined | string;
  height: undefined | string;
};

export type IconType = "img" | "emoji" | null;
export type SubCommentType = {
  id: string;
  userName: string;
  content: string;
  editTime: string;
  createTime: string;
};
export type CommentType = "open" | "resolve";
export type MainCommentType = SubCommentType & {
  type: CommentType;
  selectedText: null | string;
  subComments: SubCommentType[] | null;
  subCommentsId: string[] | null;
};
export type Block = {
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
 * path,page list 등 page의 block date를 제외한 page에 대한 간략한 정보를 담은 export type
 */
export type ListItem = {
  id: string;
  title: string;
  iconType: IconType;
  icon: string | Emoji | null;
  subPagesId: string[] | null;
  parentsId: string[] | null;
  editTime: string;
  createTime: string;
};

export type PageType = "page" | "template";
export type PageHeader = {
  title: string;
  iconType: IconType;
  icon: string | Emoji | null;
  cover: string | null;
  comments: MainCommentType[] | null;
};
export type Page = {
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
 * 삭제된 page가 보여있는 trash에서의 page export type
 */
export type TrashPage = Page & {
  subPages: Page[] | null;
};

export type Notion = {
  pagesId: string[] | null;
  firstPagesId: string[] | null;
  templatesId: string[] | null;
  pages: Page[] | null;
  trash: {
    pagesId: string[] | null;
    pages: TrashPage[] | null;
  };
};
//side
export type SideAppear = "lock" | "float" | "floatHide" | "close";
//user
export type UserState = {
  userName: string;
  userEmail: string;
  favorites: string[] | null;
  recentPagesId: string[] | null;
};
