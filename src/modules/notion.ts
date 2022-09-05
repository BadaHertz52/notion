import { Emoji, emojis } from '../components/IconPoup';
export const emojiPath ="https://raw.githubusercontent.com/BadaHertz52/notion/master/image/emoji/";
const catImg = 'https://raw.githubusercontent.com/BadaHertz52/notion/master/src/assests/img/michael-sum-LEpfefQf4rU-unsplash.jpg' ;
const imgBlockImg ='https://raw.githubusercontent.com/BadaHertz52/notion/master/src/assests/img/roses-gfcb7dbdd4_640.jpg';
//TYPE 
export const text= "text" as const ;
export const toggle ="toggle" as const  ;
export const todo = "todo" as const ;
export const todo_done ="todo done" as const;
export const h1 ="h1" as const ;
export const h2 ="h2" as const ;
export const h3 ="h3" as const ;
export const page ="page" as const ;
export const image ="image media" as const; 
export const bookmark ="bookmark media" as const; 
export const numberList ="numberList" as const;
export const bulletList ="bulletList" as const ;
export const blockTypes =[text, toggle, todo, todo_done,image, bookmark, h1, h2, page, numberList, bulletList];

export type BlockType= typeof text|typeof toggle|typeof todo |typeof todo_done|typeof image|typeof bookmark |typeof h1|typeof h2|typeof h3 |typeof page |typeof numberList |typeof bulletList ;

export const defaultColor :string ="initial" as const ;
export const grey :string="#bdbdbd" as const ;
export const orange:string ="#ffa726" as const;
export const green:string ="#00701a" as const;
export const blue :string ="#1565c0" as const;
export const red : string ="#d32f2f" as const;
export const bg_default :string ="initial" as const ;
export const bg_grey:string = "#e0e0e0" as const;
export const bg_yellow:string ="#fff9c4" as const;
export const bg_green:string ="#ebffd7" as const;
export const bg_blue :string ="#e3f2fd" as const;
export const bg_pink : string ="#fce4ec" as const;

export type ColorType = typeof defaultColor|typeof grey|typeof orange| typeof green| typeof blue| typeof red ;
export type BgColorType = typeof bg_default| typeof bg_grey|typeof bg_yellow| typeof bg_green| typeof bg_blue| typeof bg_pink ;

export type BlockStyle ={
  color: ColorType,
  bgColor: BgColorType,
  width: undefined | string,
  height :undefined | string
};
export const basicBlockStyle:BlockStyle ={
  color: defaultColor,
  bgColor: bg_default,
  width: undefined,
  height :undefined
};
const userName= "amet";
const editTime =JSON.stringify(Date.now());

const img ="img";
const emoji ="emoji";
export type IconType = typeof img|typeof emoji |null ;

export type CommentType ={
  id: string,
  userName:string,
  content: string,
  editTime: string,
  createTime:string,
}
export type BlockCommentType = CommentType &{
  type:"open"|"resolve",
  subComments:CommentType[]|null,
  subCommentsId : string[] |null,
};
export type Block ={
  /** 새로 만들어진 block.id 는 `${page.id}_${number}_${editTime}` 형식 */
  id:string,
  contents:string, 
  firstBlock:boolean,
  subBlocksId : string[]|null ,
  parentBlocksId: string[]|null,
  type: BlockType ,
  iconType:IconType,
  icon: string|Emoji| null ,
  editTime: string ,
  createTime:string,
  style :BlockStyle,
  comments :BlockCommentType[] |null
} ;

export  const blockSample:Block ={
  id:`blockSample_${editTime}`,
  contents:"",
  firstBlock:true,
  subBlocksId:null ,
  parentBlocksId: null,
  type:text,
  iconType:null,
  icon:null,
  editTime:editTime,
  createTime:JSON.stringify(Date.now()),
  style :basicBlockStyle ,
  comments:null
};
export function makeNewBlock(page:Page, targetBlock:Block|null, newBlockContents :string):Block{
  let number =page.blocksId.length.toString();
  const editTime= JSON.stringify(Date.now());
  const newBlock:Block ={
    id: `${page.id}_${number}_${editTime}`,
    editTime:editTime,
    createTime:editTime,
    type:"text",
    contents: newBlockContents === "<br>"? "": newBlockContents,
    firstBlock: targetBlock !==null? targetBlock.firstBlock : true,
    subBlocksId:targetBlock!==null? targetBlock.subBlocksId: null,
    parentBlocksId:targetBlock!==null? targetBlock.parentBlocksId : null,
    iconType:null,
    icon:null,
    style :basicBlockStyle,
    comments:null
  };
  return newBlock
};
/**
 * path,page list 등 page의 block date를 제외한 page에 대한 간략한 정보를 담은 type
 */
export type listItem = {
  id: string;
  title: string ;
  iconType:IconType,
  icon: string|Emoji| null;
  subPagesId: string[]|null;
  parentsId:string[]|null;
  editTime:string,
  createTime:string,
};
const template ="template";
type pageType = typeof page| typeof template;
export type Page ={
  id:string , 
  type:pageType,
  header : {
    title: string ,
    iconType: IconType,
    icon: string|Emoji |null,
    cover: string |null,
    comments: BlockCommentType[]| null,
  }
  firstBlocksId :string[] | null,
  blocks : Block[],  
  blocksId : string[], 
  subPagesId:string[] | null,
  parentsId: string[] | null ,
  editTime: string,
  createTime:string,
};
/**
 * 삭제된 page가 보여있는 trash에서의 page type
 */
type TrashPage =Page &{
  subPages:Page[]|null
};
export const  pageSample:Page ={
  id:editTime, 
  type:page,
  header : {
    title: "untitle",
    iconType :null,
    icon: null,
    cover: null,
    comments:  null,
  },
  firstBlocksId :null,
  blocks :  [blockSample], 
  blocksId :  [], 
  subPagesId: null,
  parentsId:  null ,
  editTime: editTime,
  createTime:editTime,
};
export type Notion={ 
  pagesId :string [],
  firstPagesId: string[],
  templatesId: string[]|null,
  pages: Page[],
  trash:{
    pagesId:string[]|null,
    pages:TrashPage[]|null
  }
};

//action
const ADD_BLOCK ="notion/ADD_BLOCK" as const;
const EDIT_BLOCK ="notion/EDIT_BLOCK" as const;
const CHANGE_BLOCK_TO_PAGE="notion/CHANGE_BLOCK_TO_PAGE" as const;
const CHANGE_PAGE_TO_BLOCK="notion/CHANGE_PAGE_TO_BLOCK" as const;
const DELETE_BLOCK ="notion/DELETE_BLOCK" as const;
const CHANGE_TO_SUB_BLOCK="notion/CHANGE_TO_SUB_BLOCK" as const;
const RAISE_BLOCK="notion/RAISE_BLOCK" as const; 

const ADD_PAGE ="notion/ADD_PAGE" as const;
const DUPLICATE_PAGE ="notion/DUPLICATE_PAGE" as const;
const EDIT_PAGE ="notion/EDIT_PAGE" as const;
const MOVE_PAGE_TO_PAGE ="notion/MOVE_PAGE_TO_PAGE" as const;
const DELETE_PAGE ="notion/DELETE_PAGE" as const;
const RESTORE_PAGE ="notion/RESTORE_PAGE" as const ;
const CLEAN_TRASH ="notion/CLEAN_TRASH" as const ;

const ADD_TEMPLATE="notion/ADD_TEMPLATE" as const;
const CANCLE_EDIT_TEMPLATE="notino/CANCLE_EDIT_TEMPLATE" as const; 
const DELETE_TEMPLATE="notion/DELETE_TEMPLATE" as const ;

export const add_block =(pageId:string, block:Block ,newBlockIndex:number ,previousBlockId:string|null)=> ({
  type:ADD_BLOCK ,
  pageId:pageId,
  block:block,
  newBlockIndex :newBlockIndex,
  /**블록과 블록 사이에 새로운 블록을 만드는 경우에 필요함 */
  previousBlockId:previousBlockId 
});
export const edit_block =(pageId:string, block:Block)=> ({
  type:EDIT_BLOCK ,
  pageId:pageId,
  /**수정된 block*/
  block:block,
});
export const change_block_to_page=(currentPageId: string, block:Block)=>({
  type:CHANGE_BLOCK_TO_PAGE,
  pageId: currentPageId,
  /** page type 으로 변경된 block */
  block:block,
});
export const change_page_to_block=(currentPageId: string, block:Block)=>({
  type:CHANGE_PAGE_TO_BLOCK,
  pageId: currentPageId,
  /** page type 에서 다른 blockType 으로 변경된 block */
  block:block,
});
export const delete_block =(pageId:string, block:Block, isInMenu:boolean)=> ({
  type:DELETE_BLOCK ,
  pageId:pageId,
  /** 삭제될 block */
  block:block,
  /** block 삭제가 menu의 delete 로 이루어진 경우  */
  isInMenu:isInMenu
});
/**
 * block을 화면상에서 앞에 위치한 block의 subBlock으로 변경하는 액션함수 
 * @param pageId  : 현재 페이지의 id
 * @param block : subBlock 으로 변경될 block
 * @param newParentBlockId : subBlock이 될 block의 새로운 parentBlock의 id
 * @returns 
 */
export const change_to_sub =(pageId:string, block:Block ,newParentBlockId:string)=> ({
  type:CHANGE_TO_SUB_BLOCK ,
  pageId:pageId,
  block:block,
  newParentBlockId:newParentBlockId
});
/**
 * block이 삭제되거나 block의 content 맨앞에서 backspace 를 누르는 경우, block의 내용이 화면상에서 block의 앞에 위치한 이전 상의 block의 내용과 합쳐지거나, 위치가 앞으로 당겨지도록 하는 액션 함수 
 * @param pageId 현재 페이지의 id
 * @param block  내용이 합쳐지거나 앞으로 당겨질 block
 * @returns 
 */
export const raise_block =(pageId:string, block:Block)=>({
  type:RAISE_BLOCK,
  pageId:pageId,
  block:block
});

export const add_page =( newPage:Page)=>({
  type: ADD_PAGE,
  pageId: "0", // 불필요하지만 다른 액션함수들에게 필요한 거라 일단 넣어줌 
  newPage: newPage,
  block:null
});

export const duplicate_page=(targetPageId:string )=>({
  type:DUPLICATE_PAGE,
  pageId:targetPageId,
  block:null,
})
export const edit_page =(pageId:string, newPage:Page )=>({
  type: EDIT_PAGE,
  pageId: pageId,
  newPage: newPage,
  block:null
});
/**
 * 페이지를 다른 페이지의 블록(blockType :page)으로 변경하는 액션함수
 * @param targetPageId 옮겨지는 페이지
 * @param destinationPageId 페이지가 옮겨질 페이지
 * @returns 
 */
export const move_page_to_page =(targetPageId:string, destinationPageId:string, )=>({
  type: MOVE_PAGE_TO_PAGE,
  pageId: targetPageId, 
  destinationPageId: destinationPageId,
  block:null
});
export const delete_page =(pageId:string)=>(
{
  type:DELETE_PAGE,
  pageId: pageId,
  block:null
});
/**
 * 삭제되어 trash에 저장된 page를 다시 notion.pages로 복구하는 액션함수
 * @param pageId 
 * @returns 
 */
export const restore_page=(pageId:string)=>(
  {
    type:RESTORE_PAGE,
    pageId:pageId,
    block:null
  }
)
/** trash의 data를 삭제하는 액션함수 */
export const clean_trash =(pageId:string)=>({
  type: CLEAN_TRASH,
  pageId:pageId,
  block:null,
});
/**
 * 새로운 template 을 만드는 액션함수
 * @param 
 * @returns 
 */
export const add_template=( template:Page)=>({
  type:ADD_TEMPLATE,
  pageId:template.id,
  template:template,
  block:null
});
/**
 * template의 수정이 있고, 사용자가 수정되기 이전의 template을 저장하기 원하는 경우  template의 date를 이전 상태로 복구하는 액션함수
 * @param templateId 복구대상인 template의 id
 * @returns 
 */
export const cancle_edit_template=(templateId: string )=>({
  type:CANCLE_EDIT_TEMPLATE,
  pageId:templateId,
  block:null
});
/**
 * template를 삭제하는 액션 함수
 * @param templateId 삭제대상인 template의 id
 * @returns 
 */
export const delete_template =(templateId:string)=>({
  type:DELETE_TEMPLATE,
  pageId:templateId,
  block:null
})
type NotionAction = 
ReturnType<typeof add_block> | 
ReturnType<typeof edit_block> | 
ReturnType<typeof change_block_to_page>|
ReturnType<typeof change_page_to_block>|
ReturnType <typeof delete_block>|
ReturnType <typeof change_to_sub>|
ReturnType < typeof raise_block>|
ReturnType<typeof add_page> | 
ReturnType<typeof duplicate_page>|
ReturnType<typeof edit_page> | 
ReturnType<typeof move_page_to_page> | 
ReturnType <typeof delete_page>|
ReturnType <typeof restore_page>|
ReturnType <typeof clean_trash>|
ReturnType <typeof add_template>|
ReturnType <typeof cancle_edit_template>|
ReturnType <typeof delete_template>
;

const day =["Mon","1", "Ths","2", "Wed","3", "Thr","4", "Fri","5", "Sat","6","Sun"];
const blockBgColor =[bg_blue,"", bg_green,"",bg_yellow,"",  bg_pink,"", bg_grey, "",bg_yellow, "",bg_blue];
const todoList =[
  '6AM :🎽 runing',
  '9AM:🏥physical checkup',
  '😊 Webtoon re-enactment',
  '8PM: 🛒Buying food ingredients in mart - sale',
  '6PM :🍴 dinner appointment with friend',
  'Dry cleaning at the dry cleaner',
  'house cleaning'];

const returnTemplateSubBlock =(day:string, index:number)=>{
  const num = index /2 ;
  const templateBlock :Block ={
    id:`templateSub_${day}`,
    contents:todoList[num],
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId:[`templateBlock_${day}`],
    type:todo,
    iconType:null,
    icon:null,
    editTime:editTime,
    createTime:JSON.stringify(Date.now()),
    style :basicBlockStyle,
    comments:null
  };
  return templateBlock
};

const returnTemplateBlock=(day:string, index:number)=>{
  const templateBlock :Block ={
    id:`templateBlock_${day}`,
    contents:`${day}`,
    firstBlock:true,
    subBlocksId:[`templateSub_${day}`] ,
    parentBlocksId: null,
    type:h3,
    iconType:null,
    icon:null,
    editTime:editTime,
    createTime:JSON.stringify(Date.now()),
    style :{
      ...basicBlockStyle,
      bgColor:blockBgColor[index]
    } , 
    comments:null
  };
  return templateBlock
};
const templateBlocks = day.map((d:string)=> {
  let returnBlock:Block
  if(day.indexOf(d)%2 ===0){
    returnBlock =returnTemplateBlock(d, day.indexOf(d) )
  }else{
    returnBlock ={
      ...blockSample,
      id:`empty${d}_${JSON.stringify(Date.now())}`
    };

  };
  return returnBlock
});

const templateBlocksId =templateBlocks.map((block:Block)=> block.id);
const templateSubBlocks =day.map((d:string)=> returnTemplateSubBlock(d, day.indexOf(d)));
const templateSubBlocksId =day.map((d:string)=>`templateSub_${d}`);
//reducer
const template1 :Page ={
  id:"template1", 
  type:template,
  header : {
    title: "To Do List ",
    iconType :"emoji",
    icon: emojis[13],
    cover: null,
    comments:  null,
  },
  firstBlocksId :templateBlocksId,
  blocks :  [...templateBlocks, ...templateSubBlocks], 
  blocksId :  [...templateBlocksId, ...templateSubBlocksId], 
  subPagesId: null,
  parentsId:  null ,
  editTime:Date.parse("2022-8-23-15:00").toString(),
  createTime:Date.parse("2022-8-23-12:00").toString(),
};
const template2 :Page ={
  id:"template2", 
  type:template,
  header : {
    title: "To Do List2 ",
    iconType :"emoji",
    icon: emojis[19],
    cover: null,
    comments:  null,
  },
  firstBlocksId :templateBlocksId,
  blocks :  [...templateBlocks, ...templateSubBlocks], 
  blocksId :  [...templateBlocksId, ...templateSubBlocksId], 
  subPagesId: null,
  parentsId:  null ,
  editTime:Date.parse("2022-8-23-15:00").toString(),
  createTime:Date.parse("2022-8-23-12:00").toString(),
};
const initialState :Notion ={
  pagesId:['12345','page1','page2' ,'1234', '123' ,'template1', 'template2'],
  firstPagesId :['12345' ,'1234', '123'],
  templatesId:['template1', 'template2'],
  pages:[
    {
    id: '12345',
    type:page,
    header : {
      title:"welcome notion 🐱",
      iconType:"img",
      icon:catImg ,
      cover: null,
      comments:[{
        id:"comment_1",
        userName:userName,
        type:"open",
        content:"this is page comment",
        editTime: Date.parse("2021-5-20-12:00")
        .toString(),
        createTime: Date.parse("2021-5-20-12:00").toString(),
        subComments:null,
        subCommentsId:null,
      }],
    },
    firstBlocksId :["text",'img', 'toggle', 'todo', 'todo done', 'h1', 'h2','h3','page1', 'page2' ,"numberList", "bulletList"],
    blocks:[{
      id:"text",
      contents:"안녕", 
      firstBlock:true,
      subBlocksId: ["sub1_1", "sub1_2"] ,
      parentBlocksId: null,
      type: text,
      iconType:null,
      icon:  null ,
      editTime:Date.parse("2021-5-18-15:00").toString(),
      createTime: Date.parse("2021-5-18-1:00").toString(),
      style :{
        ...basicBlockStyle,
        color: blue,
        bgColor: bg_default,
      },
      comments:[{
        id:"comment_text1",
        userName:userName,
        type:"open",
        content:"hi! ☺️", 
        editTime:(1654086822451).toString(),
        createTime: (Date.parse("2021-5-20-15:00")).toString(),
        subComments:null,
        subCommentsId:null,
      },]
    },
    {
      id:"img",
      contents: imgBlockImg,
      firstBlock:true,
      subBlocksId:null, 
      parentBlocksId: null,
      type: image,
      iconType:null,
      icon:  null ,
      editTime: (Date.parse("2021-5-18-16:00")).toString()
      ,
      createTime: (Date.parse("2021-5-18-2:00")).toString(),
      style :{
        ...basicBlockStyle,
        width:"222px",
        height:"auto"
      },
      comments: null
    },
    {
      id:"toggle",
      contents:"toggle toggle ",
      firstBlock:true,
      subBlocksId:null, 
      parentBlocksId: null,
      type: toggle,
      iconType:null,
      icon:  null ,
      editTime: (Date.parse("2021-5-18-16:00")).toString()
      ,
      createTime: (Date.parse("2021-5-18-2:00")).toString(),
      style :basicBlockStyle,
      comments: null
    },{
      id:"todo",
      contents:"todo", 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: todo,
      iconType:null,
      icon:  null ,
      editTime: (Date.parse("2021-5-18-16:01:00")).toString(),
      createTime: (Date.parse("2021-5-18-3:00")).toString(),
      style :{
        ...basicBlockStyle,
        bgColor: bg_yellow,
      },
      comments:[{
        id:"comment_todo1",
        userName:userName,
        type:"open",
        content:"todo comments", 
        editTime:(Date.parse("2021-5-18-16:01:30")).toString(),
        createTime: (Date.parse("2021-5-21-14:00")).toString(),
        subComments:null,
        subCommentsId:null,
      },]
    },{
      id:"todo done",
      contents:"todo done",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: todo_done,
      iconType:null,
      icon:  null ,
      editTime: (Date.parse("2021-5-19-11:30")).toString()
      ,
      createTime: (Date.parse("2021-5-18-5:00")).toString(),
      style :basicBlockStyle,
      comments:null,
    },{
      id:"h1",
      contents:'header1<span class="bg_green">header<span class="color_blue">1</span></span>h1<span class="selected bg_grey">h1</span>h1', 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h1,
      iconType:null,
      icon:  null ,
      editTime: (Date.parse("2021-5-19-12:00")).toString(),
      createTime: (Date.parse("2021-5-18-15:00")).toString(),
      style :basicBlockStyle,
      comments:null
    },{
      id:"h2",
      contents:"header2",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h2,
      iconType:null,
      icon:  null ,
      editTime: (Date.parse("2021-5-18-20:00")).toString(),
      createTime: (Date.parse("2021-5-18-15:00")).toString(),
      style :basicBlockStyle,
      comments:null
    },{
      id:"h3",
      contents:"header3", 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h3,
      iconType:null,
      icon:  null ,
      editTime: (Date.parse("2021-5-19-19:20")).toString()
      , 
      createTime: (Date.parse("2021-5-18-15:00")).toString(), 
      style :basicBlockStyle,
      comments:null
    },{
      id:"page1",
      contents:"page page page",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: page,
      iconType:null,
      icon:  null ,
      editTime: (Date.parse("2021-5-20-21:00")).toString()
      ,
      createTime: (Date.parse("2021-5-19-15:00")).toString(),
      style :basicBlockStyle,
      comments:null
    },
    {
      id:"page2",
      contents:"page2",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: page,
      iconType:"emoji",
      icon: emojis[8] ,
      editTime: (Date.parse("2021-5-20-9:00")).toString(),
      createTime: (Date.parse("2021-5-19-20:00")).toString(),

      style :basicBlockStyle,
      comments:null
    },
    {id:"sub1_1",
    contents:"sub1_1", 
    firstBlock:false,
    subBlocksId: ["sub2_1"],
    parentBlocksId: ["text"],
    type: text,
    iconType:null,
    icon:  null ,
    editTime: (Date.parse("2021-6-1-1:00")).toString() ,   
    createTime: (Date.parse("2021-5-30-15:00")).toString(),
    style :{
      ...basicBlockStyle,
    },
    comments:null
  },
  {
    id:"sub1_2",
    contents:"sub1_2", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: ["text"],
    type: text,
    iconType:null,
    icon:  null ,
    editTime: (Date.parse("2021-5-12-09:00")).toString(),
    createTime: (Date.parse("2021-5-12-08:50")).toString(),
    style :{
      ...basicBlockStyle
    },
    comments:[{
      id:"comment_sub1_2_1",
      userName:userName,
      type:"open",
      content:"subBlock comments", 
      editTime:(Date.parse("2021-5-18-8:00")).toString(),
      createTime:(Date.parse("2021-5-18-8:00")).toString(),
      subComments:null,
      subCommentsId:null,
    },]
  },
  {
    id:"sub2_1",
    contents:"sub2_1", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: ["text", "sub1_1"],
    type: text,
    iconType:null,
    icon:  null ,
    editTime: (Date.parse("2021-5-27-7:00")).toString(),
    createTime: (Date.parse("2021-5-27-7:00")).toString(),
    style :{
      ...basicBlockStyle
    },
    comments:null
  },
  {
    id:"numberList",
    contents:"", 
    firstBlock:true,
    subBlocksId:["num1", "num2", "num3"],
    parentBlocksId: null,
    type: numberList,
    iconType:null,
    icon:  null ,
    editTime: (Date.parse("2021-6-1-18:45")).toString(),
    createTime: (Date.parse("2021-6-1-18:45")).toString(),
    style :{
      ...basicBlockStyle
    },
    comments:null
  },
  {
    id:"num1",
    contents:"n1", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: [numberList],
    type: numberList,
    iconType:null,
    icon:  null ,
    editTime: (Date.parse("2021-6-1-19:03")).toString(),
    createTime: (Date.parse("2021-6-1-19:03")).toString(),
    style :{
      ...basicBlockStyle,
      bgColor: bg_green,
    },
    comments:null
  },
  {
    id:"num2",
    contents:"n2", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: [numberList],
    type: numberList,
    iconType:null,
    icon:  null ,
    editTime: (Date.parse("2021-6-1-19:03:50")).toString(),
    createTime: (Date.parse("2021-6-1-19:03:50")).toString(),
    style :{
      ...basicBlockStyle
    },
    comments:[{
      id:"comment_n2",
      userName:userName,
      type:"open",
      content:"comment n2", 
      editTime:(1654086822451).toString(),
      createTime:(1654086822451).toString(),
      subComments:null,
      subCommentsId:null,
    },]
  },
  {
    id:"num3",
    contents:"n3", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: [numberList],
    type: numberList,
    iconType:null,
    icon:  null ,
    editTime: Date.parse("2021-6-1-19:12:13").toString(),
    createTime: Date.parse("2021-6-1-19:12:13").toString(),
    style :{
      ...basicBlockStyle
    },
    comments:null
  },
  {
    id:"bulletList",
    contents:"", 
    firstBlock:true,
    subBlocksId:["b1", "b2"],
    parentBlocksId:null,
    type: bulletList,
    iconType:null,
    icon:  null ,
    editTime: (Date.parse("2021-6-1-19:13:45")).toString(),
    createTime: (Date.parse("2021-6-1-19:13:45")).toString(),
    style :{
      ...basicBlockStyle
    },
    comments:null
  },
  {
    id:"b1",
    contents:"b1", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId:[bulletList],
    type: bulletList,
    iconType:null,
    icon:  null ,
    editTime: (Date.parse("2021-6-1-19:23")).toString(),
    createTime: (Date.parse("2021-6-1-19:23")).toString(),
    style :{
      ...basicBlockStyle
    },
    comments:null
  },
  {
    id:"b2",
    contents:"b2", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId:[bulletList],
    type: bulletList,
    iconType:null,
    icon:  null ,
    editTime: (Date.parse("2021-6-1-20:12" )).toString(),
    createTime: (Date.parse("2021-6-1-20:12" )).toString(),
    style :{
      ...basicBlockStyle
    },
    comments:null
  },

    ],
    blocksId:["text",'img', 'toggle', 'todo', 'todo done', 'h1', 'h2','h3','page1', 'page2' , 'sub1_1' ,'sub1_2', 'sub2_1' ,"numberList" , "num1", "num2", "num3" , "bulletList", "b1", "b2"],
    subPagesId:['page1','page2'],
    parentsId: null,
    editTime :(Date.parse("2021-5-16-15:00")).toString(),
    createTime :(Date.parse("2021-5-16-15:00")).toString(),
  },
  {
    ...pageSample,
    id:"page1",
    header:{
      ...pageSample.header,
      title:"page page page"
    },
    blocks:[{
      id:"img",
      contents: imgBlockImg,
      firstBlock:true,
      subBlocksId:null, 
      parentBlocksId: null,
      type: image,
      iconType:null,
      icon:  null ,
      editTime: (Date.parse("2021-5-18-16:00")).toString()
      ,
      createTime: (Date.parse("2021-5-18-2:00")).toString(),
      style :basicBlockStyle,
      comments: null
    }],
    blocksId:["img"],
    firstBlocksId:["img"],
    editTime: (Date.parse("2021-5-20-21:00")).toString(),
    createTime: (Date.parse("2021-5-20-21:00")).toString(),
    parentsId:['12345']
  },
  {
    ...pageSample,
    id:"page2",
    header:{
      ...pageSample.header,
      iconType:"emoji",
      icon:emojis[8],
      title:"page2"
    },
    editTime: JSON.stringify(Date.parse("2021-5-20-9:00")),
    createTime: JSON.stringify(Date.parse("2021-5-20-9:00")),
    parentsId:['12345']
  },
  {
    id: '1234',
    type:page,
    header : {
      title:"notion2",
      iconType:"emoji",
      icon:emojis[2],
      cover: null,
      comments:  null,
    },
    firstBlocksId:null,
    blocks:[blockSample],
    blocksId:[blockSample.id],
    subPagesId:null,
    parentsId: null,
    editTime:JSON.stringify(Date.parse("2021-5-18-19:00")),
    createTime:JSON.stringify(Date.parse("2021-5-18-19:00")),
  },
  {
    id: '123',
    type:page,
    header : {
      title:"notion3",
      iconType:"emoji",
      icon:emojis[10] ,
      cover: null,
      comments:  null,
    },
    firstBlocksId:null,
    blocks:[blockSample],
    blocksId:[blockSample.id],
    subPagesId:null,
    parentsId:null,
    editTime:JSON.stringify(Date.parse("2021-5-13-15:00")),
    createTime:JSON.stringify(Date.parse("2021-5-13-15:00")),
  },
  template1,
  template2
],
  trash:{
    pagesId:null,
    pages:null
  }
};
/**
 * block.id로 block을 찾을 수 있는 함수
 * @param page 찾을 block이 존재하는 페이지
 * @param blockId 찾을 block의 아이디
 * @returns index: block의 page.blocks에서의 index, BLOCK: 찾는 block
 */
export function findBlock( page:Page,blockId: string):{index: number ,BLOCK:Block} {
  const index = page.blocksId.indexOf(blockId) as number;
  const block:Block = page.blocks[index];

  return {
    index: index,
    BLOCK:block,
  }
};
/**
 * subBlock 의 바로 윗대의 parentBlock를 찾는 함수
 * @param page subBlock이 존재하는 page
 * @param subBlock  parentBlock을 찾는데 기준이 되는 subBlock
 * @returns parentBlockIndex: parentBlock의 page.blocks에서의 index, parentBloc: 찾고자 한 parentBlock
 */
export function findParentBlock ( page:Page, subBlock:Block) : { parentBlockIndex:number, parentBlock:Block} {
  const parentBlocksId =subBlock.parentBlocksId  as string[];
  const last:number =parentBlocksId.length-1;
  const parentBlockId =parentBlocksId[last]  ;
  const {index, BLOCK} = findBlock(page, parentBlockId );
  return {
    parentBlockIndex : index,
    parentBlock :BLOCK
  };
};
export const findPage =(pagesId: string[] ,pages:Page[] ,pageId:string):Page|TrashPage=>{
  const index :number =pagesId.indexOf(pageId);
  const PAGE :Page|TrashPage = pages[index];
  return PAGE
};
  
  /**
   * 페이지 상의 block(=@param block)의 앞에 있는 block(=previousBlockInDoc)를 찾는 함수
   * @param page 현재 페이지
   * @param block  previousBlock의 기준이 되는 block
   * @returns  block의 앞에 있는 previousBlock과 previsousBlockIndex(=page.blocksId.indexOf(previsousBlock.id))
   */
  export const findPreviousBlockInDoc=(page:Page, block:Block):{previousBlockInDoc:Block,
    previousBlockInDocIndex: number}=>{
      let previousBlockInDoc =blockSample;
      let previousBlockIndex =0;
      const findLastSubBLOCK=(targetBlock:Block)=>{
        if(targetBlock.subBlocksId!==null){
          const lastSubBlockId= targetBlock.subBlocksId[targetBlock.subBlocksId.length-1];
          console.log("targetBLock", targetBlock, lastSubBlockId);
          const {BLOCK,index} = findBlock(page,lastSubBlockId);
          if(BLOCK.subBlocksId==null){
            previousBlockInDoc =BLOCK;
            previousBlockIndex= index;
          }else{
            findLastSubBLOCK(BLOCK);
          }
        }
      };
      if(page.firstBlocksId!==null){
        if(block.firstBlock){
          const blockIndexAsFirstBlock= page.firstBlocksId.indexOf(block.id);
          const previousFirstBlockId= page.firstBlocksId[blockIndexAsFirstBlock-1];
          const {BLOCK,index} =findBlock(page, previousFirstBlockId);
          const previousFirstBlock =BLOCK;
          const previousFirstBlockIndex =index;
          if(previousFirstBlock.subBlocksId===null){
            previousBlockInDoc = previousFirstBlock;
            previousBlockIndex =previousFirstBlockIndex;
          }else{
  
            findLastSubBLOCK(previousFirstBlock);
          }
        };
        if(!block.firstBlock){
          const {parentBlock, parentBlockIndex} =findParentBlock(page, block);
          if(parentBlock.subBlocksId!==null){
            const blockIndexAsSubBlock = parentBlock.subBlocksId.indexOf(block.id);
            if(blockIndexAsSubBlock === 0){
              previousBlockInDoc =parentBlock;
              previousBlockIndex =parentBlockIndex;
            }else{
              const previousSubBlockId= parentBlock.subBlocksId[blockIndexAsSubBlock-1];
              const {BLOCK, index}= findBlock(page, previousSubBlockId);
              const previousSubBlock =BLOCK;
              if(previousSubBlock.subBlocksId==null){
                previousBlockInDoc =previousSubBlock;
                previousBlockIndex =index;
              }else{
                findLastSubBLOCK(previousSubBlock);
              }
            }
          }
        };
      };
      return {previousBlockInDoc:previousBlockInDoc,
              previousBlockInDocIndex: previousBlockIndex        
      }
    }
export default function notion (state:Notion =initialState , action :NotionAction) :Notion{
  const pagesId = [...state.pagesId];
  const firstPagesId=[...state.firstPagesId];
  const templatesId =state.templatesId ==null? null: [...state.templatesId];
  const pages =[...state.pages];
  let trash = {
    pagesId:state.trash.pagesId? [...state.trash.pagesId] :null,
    pages: state.trash.pages? [...state.trash.pages]:null
  };
  const pageIndex:number = action.type !==RESTORE_PAGE ?  
                            pagesId.indexOf(action.pageId) as number :
                            trash.pagesId?.indexOf(action.pageId) as number;
  const targetPage : Page |TrashPage  =  action.type !==RESTORE_PAGE ? 
                        pages[pageIndex] as Page: 
                        trash.pages !==null?
                        trash.pages[pageIndex] as TrashPage: 
                        {...pageSample, subPages:null};
  const  blockIndex:number = action.block !==null ?( pages[pageIndex]?.blocksId.indexOf(action.block.id) ): 0 as number;

  const editBlockData =(index:number ,block:Block)=>{
    targetPage?.blocks.splice(index,1,block);
    console.log("editBlockData",  block, targetPage.blocks);
  };
  /**
   * subBlock 추가 시에 subBlock의 parentBlock을 수정 하는 함수 (parentBlock.subBlocksId 수정)
   * @param subBlock  추가 되는 subBlock
   * @param previousBlockId 추가 되는 subBlock의 parentBlock.subBlocksId의 index를 설정하기 위한 param ,추가 되는 subBlock 앞에 이미 다른 subBlock이 있는 경우면 앞에 있는 subBlock = previoustBlock
   */
  const updateParentBlock =(subBlock:Block , previousBlockId:string|null)=>{
    if(subBlock.parentBlocksId!==null ){
      //find parentBlock
        const {parentBlockIndex, parentBlock} =findParentBlock(targetPage, subBlock);
        
        const subBlocksId = parentBlock.subBlocksId;
        if(subBlocksId!==null){
          const previousBlockIndex = previousBlockId=== null? -1 : subBlocksId.indexOf(previousBlockId) as number;
          
          subBlocksId.splice(previousBlockIndex+1,0,subBlock.id);
        };

        //edit parentBlock 
        const editedParentBlock :Block={
          ...parentBlock,
          subBlocksId:subBlocksId !==null ? subBlocksId : [subBlock.id]
        };
        //update parentBlock
        targetPage.blocks.splice(parentBlockIndex,1,editedParentBlock);
        console.log("updateparent", parentBlock, editedParentBlock);
        
        
    }else{
      console.log("can't find parentBlocks of this block")
    }
  };

/**
 * block.firstBlock== true인 block이 삭제될 경우, page의 firstBlocksId 수정하는 함수
 * @param page 현재 페이지
 * @param block 삭제될 block
 */
  const editFirstBlocksId=(page:Page, block:Block)=>{
    if(block.firstBlock && page.firstBlocksId!==null){
      const firstIndex:number= page.firstBlocksId.indexOf(block.id) as number;
      if( block.subBlocksId!==null){
        if(firstIndex ===0){
          page.firstBlocksId =[...block.subBlocksId, ...page.firstBlocksId?.slice(1)];
        }else{
          const pre = page.firstBlocksId.slice(0, firstIndex);
          if(firstIndex === page.firstBlocksId.length-1){
            page.firstBlocksId =pre.concat(block.subBlocksId);
          }else{
            const after =page.firstBlocksId.slice(firstIndex+1);
            page.firstBlocksId=pre.concat(block.subBlocksId).concat(after);
          }
        }
      };
      if(block.subBlocksId ==null){
        page.firstBlocksId.splice(firstIndex,1);
      };};
  };
  /**
   * block이 삭제되거나, 한단계 올려지거나, 이전 block과 합쳐지게 되는 경우에 subBlock의 parentBlocksId 를 수정하는 함수 
   * @param page  현재 페이지
   * @param block  삭제,올려지거나 이전 블럭과 합쳐지는 블록
   * @param blockDelete  raise되는 이유가 블럭의 삭제때문인지 여부 
   */
  const raiseSubBlock =(page:Page,block :Block, blockDelete:boolean)=>{
    if(block.subBlocksId !==null  ){
    // 가정 설명 : 삭제 시 , 삭제되는 block 이 firstBlock 이면 subBlock 은 firstBlock 이 되고 아니면 화면상 이전 블록의 subBlock이 됨
  
    const subBlocks :Block[] =block.subBlocksId.map((id:string)=> {
      const BLOCK =findBlock(page, id).BLOCK;
      return BLOCK 
    });
    subBlocks.forEach((subBlock:Block)=>{
      if(subBlock.parentBlocksId!==null){
        const raisedSubBlock :Block ={
          ...subBlock,
          parentBlocksId: blockDelete ? block.parentBlocksId : subBlock.parentBlocksId.slice(1),
          firstBlock:blockDelete? block.firstBlock : false, 
          editTime:editTime
        };
        console.log( "originblock",subBlock,"raisedblock", raisedSubBlock)
        const index = page.blocksId.indexOf(subBlock.id);
        editBlockData(index, raisedSubBlock);
        subBlock.subBlocksId !==null && raiseSubBlock(page, subBlock, blockDelete);
      }
    });
    //block 삭제와 page firstBlockId 수정은 따로 (sub=sub에서도 실행하기 때문에 sub만 수정 )
    };
  };
  /**
   * raiseBlock으로 이전 block과 내용이 합쳐져 해당 block이 삭제된 경우, 해당 block의 subBlocks의 parentsBlocksId를 수정하고 subBlocks가 firstBlock이 된 경우 page.firstBlocksId를 수정하는 함수
   * @param page 현재 페이지
   * @param block   삭제된 block, 수정된 subBlocks의 parentBlock
   */
  const updateNewParentAndFirstBlocksIdAfterRaise= (page:Page, block:Block)=>{
    const subBlocksId =block.subBlocksId;
    if(subBlocksId !==null && block.parentBlocksId!==null){
      const {parentBlock ,parentBlockIndex} =findParentBlock(page, block);
      let parentSubsId =parentBlock.subBlocksId as string[];
      const index =parentSubsId.indexOf(block.id);
      if(index ===0){
        parentSubsId =[...subBlocksId]
      }else{
        if(index === parentSubsId.length-1){
          parentSubsId = parentSubsId.slice(0, index).concat(subBlocksId);
        }else{
          const pre = parentSubsId.slice(0, index);
          const after =parentSubsId.slice(index+1);
          parentSubsId =pre.concat(subBlocksId).concat(after);
        }
      };
      const newParentBlock :Block ={
        ...parentBlock,
        subBlocksId :parentSubsId,
        editTime:editTime
      };
      editBlockData(parentBlockIndex, newParentBlock);
    };
    editFirstBlocksId(page, block);
  };
  /**
   * page에서 block 의 data를 삭제하는 함수
   * @param page :현재 페이지
   * @param block :삭제 대상인 block
   */
  const deleteBlockData =(page:Page, block:Block)=>{
    const index = page.blocksId.indexOf(block.id);
    if(block.firstBlock && page.firstBlocksId !==null){
      const firstIndex= page.firstBlocksId.indexOf(block.id);
      block.firstBlock && firstIndex >=0 && page.firstBlocksId?.splice(firstIndex,1);
    };
    page.blocks?.splice(index,1);
    page.blocksId?.splice(index,1);
  };

  switch (action.type) {
    case ADD_BLOCK:
      if(action.newBlockIndex===0){
        // 새로운 블럭이 page 의 첫번째 블럭인 경우
        targetPage.blocks =[action.block];
        targetPage.blocksId=[action.block.id];
      }else{
        targetPage.blocks?.splice(action.newBlockIndex, 0, action.block);
        targetPage.blocksId?.splice(action.newBlockIndex, 0, action.block.id);
      };

      if(action.block.firstBlock){
        if(targetPage.firstBlocksId!==null){
          if(action.previousBlockId !==null){
            const firstIndex = targetPage.firstBlocksId.indexOf(action.previousBlockId);
            targetPage.firstBlocksId.splice(firstIndex+1, 0,action.block.id);
          }else{
            targetPage.firstBlocksId =targetPage.firstBlocksId.concat(action.block.id);
          }

        }else{
          targetPage.firstBlocksId =[action.block.id]
        }

      }else{
              //subBlock 으로 만들어 졌을 때 
        if(action.block.parentBlocksId!==null){
        updateParentBlock(action.block , action.previousBlockId);
        };
      };

      if(action.block.subBlocksId!==null && action.previousBlockId!==null){
        // subBlock을 가지는 블록을 기준으로 그 다음 블록으로 만들어진 경우  
        const previousBlock = findBlock(targetPage, action.previousBlockId).BLOCK;
        previousBlock.subBlocksId =null;

        action.block.subBlocksId.forEach((id:string)=>{
          const BLOCK = findBlock(targetPage, id).BLOCK;
          const parentIndex= BLOCK.parentBlocksId?.indexOf(action.previousBlockId as string);
          parentIndex !==undefined &&
          BLOCK.parentBlocksId?.splice(parentIndex,1, action.block.id);
        })
      };
      //새롱 만들어진 block 에 포거스를 두기 위해 
      sessionStorage.setItem("newBlock", action.block.id);
      if(action.block.type ==="page"){
        // 만들어진 블록의 type 이 page 인 경우 
        const newPage:Page ={
          ...pageSample,
          id:action.block.id,
        };
        addPage(newPage);
        if(action.block.parentBlocksId !==null){
          const parentPage =findPage(pagesId, pages, action.block.parentBlocksId[0]) as Page ;
          const editedParentPage:Page ={
            ...parentPage,
            blocks: parentPage.blocks.concat(action.block),
            blocksId:parentPage.blocksId.concat(action.block.id),
            firstBlocksId:parentPage.firstBlocksId!==null?  parentPage.firstBlocksId?.concat(action.block.id) : [action.block.id],
            subPagesId: parentPage.subPagesId ==null? [...blockSample.id] : parentPage.subPagesId.concat([blockSample.id]),
            editTime:editTime
          };
          editPage(editedParentPage);
        }
      };
      console.log( "addBlock", targetPage)
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      }; 
    case EDIT_BLOCK:
      editBlockData(blockIndex, action.block);
      console.log("edit",action.block  ,targetPage.blocks )
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      };
    case CHANGE_BLOCK_TO_PAGE :
      const changedTypeBlock:Block ={
        ...action.block,
        contents:action.block.contents===""? "untitle": action.block.contents,
        type:"page",
        subBlocksId:null,
        editTime:editTime
      };
      editBlockData(blockIndex,changedTypeBlock);
      let newBlocksId =[blockSample.id];
      let newBlocks =[blockSample];
      let newFirstBlocksId =[blockSample.id];
      let newSubPagesId: string[]|null = null;
      const allSubBlocks = targetPage.blocks.filter((block:Block)=> block.parentBlocksId?.includes(action.block.id));
      if(allSubBlocks[0]!==undefined){
        newBlocks = allSubBlocks.map((block:Block)=>{
          const newParentBlocksId =block.parentBlocksId !==null ? block.parentBlocksId.slice(1) : null; 
          const newBlock:Block ={
            ...block,
            parentBlocksId: newParentBlocksId !==null?( newParentBlocksId[0]===undefined? null : newParentBlocksId): null,
            firstBlock: newParentBlocksId ==null || newParentBlocksId[0]===undefined,
          };
          return newBlock
        });
        newBlocksId = newBlocks.map((block:Block)=>block.id);
        newFirstBlocksId = newBlocks.filter((block:Block)=> block.firstBlock ===true).map((block:Block)=> block.id);
        newSubPagesId = newBlocks.filter((block:Block)=> block.type==="page").map((block:Block)=>block.id);
        if(newBlocks[0] !==undefined ){
          targetPage.blocks = targetPage.blocks.filter((block:Block)=> !newBlocksId.includes(block.id) );
          targetPage.blocksId = targetPage.blocksId.filter((id:string)=> !newBlocksId.includes(id));
        }
        if( newSubPagesId[0]!==undefined && targetPage.subPagesId !==null){
          targetPage.subPagesId= targetPage.subPagesId.filter((id:string)=> !newSubPagesId?.includes(id));
        };
      }
      const newPage:Page ={
        id:action.block.id,
        type:page,
        header:{
          title: action.block.contents ===""?"untitle" :action.block.contents,
          iconType: action.block.iconType,
          icon: action.block.icon,
          cover:null,
          comments:action.block.comments
        },
        firstBlocksId:newFirstBlocksId,
        blocksId:newBlocksId,
        blocks:newBlocks,
        subPagesId: newSubPagesId ==null? null : (newSubPagesId[0]===undefined ? null : newSubPagesId) ,
        parentsId: [action.pageId],
        editTime: action.block.editTime,
        createTime: action.block.createTime,
      };
      addPage(newPage);

      console.log("change block type to page", targetPage, newPage)
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      };
    case CHANGE_PAGE_TO_BLOCK:
      const changedTargetPageIndex= pagesId.indexOf(action.block.id);
      const changedTargetPage =pages[changedTargetPageIndex];
      deleteTargetPageData(changedTargetPage ,changedTargetPageIndex ,false);
      const changedBlock:Block ={
        ...action.block,
        subBlocksId: changedTargetPage.blocksId,
        editTime:editTime
      };
      editBlockData(blockIndex, changedBlock);
      const newSubBlocks :Block[]=changedTargetPage.blocks.map((block:Block)=>({
        ...block,
        firstBlock:false,
        parentBlocksId:block.parentBlocksId!==null? [action.block.id ,...block.parentBlocksId] :[action.block.id]
      }))
      targetPage.blocks.push.apply(targetPage.blocks, newSubBlocks);
      targetPage.blocksId.push.apply(targetPage.blocksId ,changedTargetPage.blocksId);
      console.log("changePagetoBlock",targetPage, pages, pages[pageIndex],pagesId);
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      };
    case CHANGE_TO_SUB_BLOCK:
    //1. change  action.block's new parentBlock
      const {BLOCK, index} = findBlock(targetPage, action.newParentBlockId);
      const parentBlock:Block ={
        ...BLOCK,
        subBlocksId: BLOCK.subBlocksId !==null? BLOCK.subBlocksId.concat(action.block.id)  :[action.block.id],
        editTime:editTime
      }
      const parentBlockIndex =index;
      editBlockData(parentBlockIndex, parentBlock);
    
    //2. change actoin.block to subBlopck : edit parentsId of action.block 
      const editedBlock :Block ={
        ...action.block,
        firstBlock: false,
        parentBlocksId: parentBlock.parentBlocksId !==null?
                        parentBlock.parentBlocksId.concat(parentBlock.id):
                        [parentBlock.id],
        editTime:editTime
      }
      editBlockData(blockIndex,editedBlock);
      // 3. first-> sub 인 경우  
      if(action.block.firstBlock){
        // delte  id from firstBlocksId
        const index:number = targetPage.firstBlocksId?.indexOf(action.block.id) as number;
        targetPage.firstBlocksId?.splice(index,1);
      };
       // 4. action.block의 subBlock 에서 다른 subBlock 으로 변경되었을 경우 
      if(action.block.parentBlocksId !==null){
        const previouseParentBlockId = action.block.parentBlocksId[action.block.parentBlocksId.length-1];
        const {BLOCK, index} =findBlock(targetPage,previouseParentBlockId);
        const edtitedPreviousParentBlock :Block ={
          ...BLOCK,
          subBlocksId: BLOCK.subBlocksId !==null?BLOCK.subBlocksId.filter((id:string)=> id !== action.block.id) :null ,
          editTime:editTime,
        };
        editBlockData(index, edtitedPreviousParentBlock);
      };
      console.log("CHANGE subBlock", targetPage.blocks);
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      }; 

    case RAISE_BLOCK :
      /*  cursor.anchorOffset== 0 일때 backspace 를 누를때 단. targetPage의 fistBlocksId 의 첫번째 인수는 불가 
        result1 combine: previsouBlockInDoc 의 content 수정 
          case1. actionblock 이 firstBlock 인 경우, 
          case2.  block 이 sub 이면 뒤에 다른 subBlock이 있는 경우

        result2.pull: action block 의 subBlock 앞으로 땡기기 
        */
        if(targetPage.firstBlocksId!==null &&
          targetPage.firstBlocksId[0] !== action.block.id
          ){
            const targetBlock =action.block; 
            const {previousBlockInDoc , previousBlockInDocIndex}=findPreviousBlockInDoc(targetPage, action.block);
            /**
             * raiseBlock 시  previousBlock의 내용에 block의 내용을 합치는 함수
             * @param parentBlock : previoustBlock이 parentBlock일 경우를 위한 param
             * @param parentBlockIndex :previoustBlock이 parentBlock일 경우를 위한 param
             */
            const combineContents=(parentBlock:Block|null, parentBlockIndex:number|null)=>{
              console.log("content combine")
              const editedPreBlockInDoc :Block ={
                ...previousBlockInDoc,
                contents: `${previousBlockInDoc.contents}${targetBlock.contents}`,
                editTime:editTime
              };

              if(parentBlockIndex!==null && parentBlock!==null && parentBlock.subBlocksId!==null){
                const newSubBlocksId =parentBlock.subBlocksId.filter((id:string) => id !== targetBlock.id); 

                const newParentBlock :Block ={
                  ...parentBlock,
                  subBlocksId: newSubBlocksId[0]===undefined? null: newSubBlocksId,
                  editTime:editTime
                };
                if(parentBlock.id === previousBlockInDoc.id){
                  const newParentBlockAlsoPreviousBlock :Block ={
                    ...newParentBlock,
                    contents:editedPreBlockInDoc.contents
                  };
                  editBlockData(parentBlockIndex,newParentBlockAlsoPreviousBlock);
                }else{
                  editBlockData(previousBlockInDocIndex, editedPreBlockInDoc);
                  editBlockData(parentBlockIndex,newParentBlock);
                }
              }else{
                editBlockData(previousBlockInDocIndex, editedPreBlockInDoc);
              };

              targetPage.blocks.splice(blockIndex,1);
              targetPage.blocksId.splice(blockIndex,1);
              
              raiseSubBlock(targetPage, action.block, true);
              updateNewParentAndFirstBlocksIdAfterRaise(targetPage, action.block);
              //firstBlocksId는 따로 
            };
            /**
             * rasieBlock 시, block를 앞으로 당기는(sub->parent)함수
             * @param subBlocksId : block의 parentBlock.subBlocksId
             * @param targetBlockIndexInSubBlocks : block의 subBlocksId 에서의 index
             * @param parentBlock: block의 parentBlock
             * @param parentBlockIndex: block의 parentBlock의  page.blocks에서의 index
             */
            const pullBlock=(subBlocksId:string[], targetBlockIndexInSubBlocks:number, parentBlock:Block, parentBlockIndex:number)=>{
              console.log("pull");
                  raiseSubBlock(targetPage, action.block, false);
                  const editedTargetBlock :Block ={
                    ...targetBlock,
                    parentBlocksId:parentBlock.parentBlocksId,
                    firstBlock:parentBlock.firstBlock,
                    editTime:editTime
                  };
                    editBlockData(blockIndex, editedTargetBlock);
                    subBlocksId.splice(targetBlockIndexInSubBlocks,1);
                    const editedParentBlock:Block ={
                      ...parentBlock,
                      subBlocksId: subBlocksId[0]===undefined ? null: subBlocksId,
                      editTime:editTime
                    };
                    editBlockData(parentBlockIndex, editedParentBlock);
                    //edit fristBlock
                    if(parentBlock.firstBlock && targetPage.firstBlocksId!==null){
                      const firstIndex= targetPage.firstBlocksId.indexOf(parentBlock.id);
                      targetPage.firstBlocksId.splice(firstIndex+1,0, targetBlock.id);
                      console.log("firsindex", firstIndex);
                    };
                  
                    if(parentBlock.parentBlocksId !==null){
                      const grandParentBlockId = parentBlock.parentBlocksId[parentBlock.parentBlocksId.length -1];
                      const {BLOCK, index}= findBlock(targetPage, grandParentBlockId);
                      const grandParentBlock =BLOCK;
                      const grandParentBlockIndex= index; 
                        if(grandParentBlock.subBlocksId!==null){
                          const grandSubsId = [...grandParentBlock.subBlocksId];
                          const subIndex= grandSubsId.indexOf(parentBlock.id);
                          grandSubsId.splice(subIndex+1,0,targetBlock.id);
                          const newGrandParentBlock:Block ={
                            ...grandParentBlock,
                            subBlocksId:grandSubsId,
                            editTime:editTime
                          };
                          console.log("grandParent")
                          editBlockData(grandParentBlockIndex, newGrandParentBlock);
                        }
                    }
            };
            //
            if(targetBlock.firstBlock){
              //combine -case1
              combineContents(null,null);
            }else{
              const {parentBlock, parentBlockIndex} =findParentBlock(targetPage, targetBlock);
              if(parentBlock.subBlocksId!==null){
                /**
                 * paretBlock.subBlocksId를 복사한 것
                 */
                const subBlocksId =[...parentBlock.subBlocksId]; 
                const targetBlockIndexInSubBlocks = subBlocksId.indexOf(targetBlock.id);

                if(targetBlockIndexInSubBlocks < subBlocksId.length-1){
                  //combine -case2
                  combineContents(parentBlock, parentBlockIndex);
                }else{
                  //pull
                  pullBlock(subBlocksId, targetBlockIndexInSubBlocks, parentBlock, parentBlockIndex);
                };
                
              };
            };
        };
        console.log("raiseBlock", pages[pageIndex]);
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      }; ;

    case DELETE_BLOCK:

      if(action.block.parentBlocksId !== null){
        const parentBlocksId = action.block?.parentBlocksId as string[];
        const parentBlockId :string = parentBlocksId[parentBlocksId.length-1] ;
        const parentBlockIndex = targetPage.blocksId.indexOf(parentBlockId);
        const parentBlock = targetPage.blocks[parentBlockIndex];
        const newSubBlocksId  = parentBlock.subBlocksId?.filter((id:string)=> id !== action.block.id) as string[] ;
        if(newSubBlocksId[0] !== undefined){
          editBlockData( parentBlockIndex, {
            ...parentBlock,
            subBlocksId: newSubBlocksId
          })
        }else{
          if(action.block.type.includes("List")){
            deleteBlockData(targetPage, parentBlock);
          }else{
            editBlockData( parentBlockIndex, {
              ...parentBlock,
              subBlocksId: null,
            })
          }
        };
      };
      // 삭제 타깃인 block 이 subBlock을 가지는 경우 .... 
      if(action.isInMenu){
        
        deleteBlockData(targetPage,action.block);
      }else{
        raiseSubBlock(targetPage, action.block ,true);

        editFirstBlocksId(targetPage, action.block);
        targetPage.blocks.splice(blockIndex,1);
        targetPage.blocksId.splice(blockIndex,1);
      };
      if(action.block.type ==="page"){
        deletePage(action.block.id, false);
      }
      console.log("delete", pages[pageIndex]);
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      };
    case ADD_PAGE :
      function addPage(newPage:Page){
        pagesId.push(newPage.id);
        pages.push(newPage);
      if(newPage.parentsId==null){
        //firstPage 일경우
          firstPagesId.push(newPage.id);
      }else{
        const parentPage:Page = findPage(pagesId,pages,newPage.parentsId[newPage.parentsId.length-1]) ;
        const parentPageIndex = pagesId.indexOf(parentPage.id);
        const editedParentPage :Page={
          ...parentPage,
          subPagesId: parentPage.subPagesId !==null? parentPage.subPagesId.concat(newPage.id) :[newPage.id],
        };
        
        pages.splice(parentPageIndex,1, editedParentPage);
      };  
      console.log("add new page", pages, firstPagesId);
      };
      addPage(action.newPage); 
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      };
    case DUPLICATE_PAGE :
      function duplicatePage(){
        const targetPageIndex = pagesId.indexOf(targetPage.id);
      const nextPageId =pagesId[targetPageIndex+1]
      const nextPage:Page =findPage(pagesId, pages, nextPageId ) ;
      let number :string ="1";
      let stop :boolean = false;
      if(nextPage.header.title === `${targetPage.header.title}(1)`){
        const slicedPages =pages.slice(targetPageIndex+1);
        for (let i = 0; i < slicedPages.length && !stop; i++) {
          const title = slicedPages[i].header.title;
          if(title === `${targetPage.header.title}(${i+1})`){
            number = (i+2).toString();
            console.log("number", number)
          }else{
            stop= true;
          }
        }
      };
      const newPage:Page ={
        ...targetPage,
        id:`${targetPage.id}_duplicate_${number}`,
        header:{
          ...targetPage.header,
          title: `${targetPage.header.title}(${number})`
        },
        editTime:editTime
      };
      if(targetPage.parentsId ==null){
        const index= firstPagesId.indexOf(targetPage.id);
        firstPagesId.splice(index+1,0, newPage.id);
      }else{
        const parentPage = {...findPage(pagesId,pages ,targetPage.parentsId[targetPage.parentsId.length-1])};
        const parentPageIndex = pagesId.indexOf(parentPage.id);
        const subPageIndex= parentPage.subPagesId?.indexOf(targetPage.id) as number;
        parentPage.subPagesId?.splice(subPageIndex,0, newPage.id);
        pages.splice(parentPageIndex,0, parentPage);
      };
      pages.splice(targetPageIndex+1, 0, newPage);
      pagesId.splice(targetPageIndex+1,0, newPage.id);
      };
      duplicatePage();
      return{
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      }
    case EDIT_PAGE :
      function editPage(newPage:Page){
        targetPage.header = newPage.header;
        const parentsId = newPage.parentsId ; 
        if(parentsId !==null){
          const parentPageId =parentsId[ parentsId.length -1];
          const parentPage =findPage(pagesId, pages, parentPageId);
          const blockIndex = parentPage.blocksId.indexOf(newPage.id);
          const pageBlock = parentPage.blocks[blockIndex];
          const editedPageBlock:Block ={
            ...pageBlock,
            contents: newPage.header.title,
            icon: newPage.header.icon,
            editTime:editTime
          };
          parentPage.blocks.splice(blockIndex,1,editedPageBlock);
        };
        const pageIndex =pagesId.indexOf(newPage.id);
        pages.splice(pageIndex,1,newPage)

        console.log("edit page",pages);
      };
      editPage(action.newPage);

      return{
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      };
    case MOVE_PAGE_TO_PAGE:
      function movePageToPage(destinationPageId: string){
        const destinationPage = findPage(pagesId, pages, destinationPageId);
      // target page 관련 변경
      if(firstPagesId.includes(targetPage.id)){
        const index = firstPagesId.indexOf(targetPage.id);
        firstPagesId.splice(index,1);
      };
      let pageBlockStyle:BlockStyle =basicBlockStyle;
      if(targetPage.parentsId !==null){
        const parentPage = findPage(pagesId, pages, targetPage.parentsId[targetPage.parentsId.length-1]);
        const blockIndex= parentPage.blocksId.indexOf(action.pageId);
        pageBlockStyle = parentPage.blocks[blockIndex].style 
        const subPageIndex= parentPage.subPagesId?.indexOf(action.pageId);
        parentPage.editTime =editTime;
        parentPage.blocks.splice(blockIndex,1);
        parentPage.blocksId.splice(blockIndex,1);
        subPageIndex !==undefined && parentPage.subPagesId?.splice(subPageIndex,1);
      };
      targetPage.editTime=editTime; 
      targetPage.parentsId =[destinationPage.id];

      //destination page 관련 변경
      const newPageBlock :Block={
        id: targetPage.id,
        contents:targetPage.header.title,
        firstBlock: true,
        subBlocksId: null,
        parentBlocksId: null,
        type:  "page",
        iconType:targetPage.header.iconType,
        icon: targetPage.header.icon,
        editTime: targetPage.editTime,
        createTime: targetPage.createTime,
        style: pageBlockStyle,
        comments: targetPage.header.comments,
      };
      destinationPage.editTime =editTime ;
  
      destinationPage.firstBlocksId !== null? destinationPage.firstBlocksId.push(newPageBlock.id) : destinationPage.firstBlocksId = [newPageBlock.id];
      destinationPage.blocks.push(newPageBlock);
      destinationPage.blocksId.push(targetPage.id);
      destinationPage.subPagesId = destinationPage.subPagesId !==null ? 
      destinationPage.subPagesId.concat(targetPage.id) :
      [targetPage.id];
      console.log("move page to other page", pages , firstPagesId , destinationPage) 
      };
      movePageToPage(action.destinationPageId);
      return{
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      };
    case DELETE_PAGE:
      function deleteTargetPageData(deletedTargetPage:Page, deletedTargetPageIndex:number, blockDelete:boolean){
        if(deletedTargetPage.parentsId !==null){
          const parentPageIndex = pagesId.indexOf(deletedTargetPage.parentsId[deletedTargetPage.parentsId.length-1]);
          const parentPage = pages[parentPageIndex];
          if(parentPage.subPagesId !==null){
            const subPageIndex= parentPage.subPagesId.indexOf(deletedTargetPage.id);
            parentPage.subPagesId.splice(subPageIndex,1);
            if(blockDelete){
              const blockIndex = parentPage.blocksId.indexOf(deletedTargetPage.id);
              parentPage.blocks.splice(blockIndex,1);
              parentPage.blocksId.splice(blockIndex,1);
            }
            console.log("parent", parentPage);
          }
        }else{
          //firstPage 일 경우
          const index= firstPagesId.indexOf(deletedTargetPage.id);
          firstPagesId.splice(index,1);
        };
        pages.splice(deletedTargetPageIndex, 1);
        pagesId.splice(deletedTargetPageIndex, 1);
      };

      function deletePage(pageId:string ,blockDelete:boolean){
        const deletedTargetPageIndex= pagesId.indexOf(pageId);
        const deletedTargetPage =pages[deletedTargetPageIndex];

        deleteTargetPageData(deletedTargetPage ,deletedTargetPageIndex ,blockDelete);
        let trashTargetPage :TrashPage ={
          ...deletedTargetPage,
          subPages:null,
        };
          if(deletedTargetPage.subPagesId !==null){
            const subPages:Page[] = deletedTargetPage.subPagesId.map((id:string)=>findPage(pagesId, pages,id));
            trashTargetPage ={
              ...deletedTargetPage,
              subPages:subPages
            }
            deletedTargetPage.subPagesId.forEach((id:string)=>{
              const index= pagesId.indexOf(id);
              pages.splice(index,1);
              pagesId.splice(index,1);
            })
        };
        trash ={
          pagesId:trash.pagesId ==null? 
          [deletedTargetPage.id] : 
          trash.pagesId.concat(deletedTargetPage.id),
          pages: trash.pages ==null? [trashTargetPage] : trash.pages.concat(trashTargetPage)
        };
        console.log("delete page", pages ,trash);
      }
      deletePage(action.pageId, true);
      return{
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      };
    case RESTORE_PAGE:
      let trashPages = trash.pages ==null? null :[...trash.pages];
      let trashPagesId =trash.pagesId ===null? null : [...trash.pagesId];
      const restoredPage :Page ={
        ...targetPage,
        editTime:editTime,
        parentsId:null,
      };
    pages.push(restoredPage);
    pagesId.push(restoredPage.id);
    firstPagesId.push(restoredPage.id);
    if(trashPages!==null && trashPagesId !==null){
      const trashTargetPage = findPage(trashPagesId, trashPages, action.pageId) as TrashPage; 
      const trashTargetPageIndex= trashPagesId.indexOf(trashTargetPage.id);
      trashPages.splice(trashTargetPageIndex,1);
      trashPagesId.splice(trashTargetPageIndex,1);
      if(trashTargetPage.subPages !==null){
        trashTargetPage.subPages.forEach((sub:Page)=>{
          pages.push(sub);
          pagesId.push(sub.id);
        })
      }
    };
      const newNotion :Notion={
        pages:pages,
        pagesId:pagesId,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        trash: (trashPages?.[0] !==undefined && trashPagesId?.[0] !==undefined)
        ? 
        {
          pages:trashPages ,
          pagesId:trashPagesId 
        }
        :
        {
          pages:null,
          pagesId:null
        }
      };
      console.log("restore",newNotion)
      return newNotion  ;
    case CLEAN_TRASH:
      trash.pages?.splice(pageIndex,1);
      trash.pagesId?.splice(pageIndex,1);
      const cleanedTrash ={
        pages:trash.pages?.[0]!==undefined? 
        trash.pages:null,
        pagesId:trash.pagesId?.[0]!==undefined? 
        trash.pagesId:null,
      };
      console.log("clean trash", cleanedTrash)
      return{
        ...state,
        trash:cleanedTrash
      };

    case ADD_TEMPLATE:
      const newTemplate :Page ={
        ...pageSample,
        type:template
      };
      pages.push(newTemplate);
      pagesId.push(newTemplate.id);

      return{
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId!==null? templatesId.concat(newTemplate.id):[newTemplate.id],
        pagesId:pagesId,
        trash:trash
      };

    case CANCLE_EDIT_TEMPLATE:
      const restorePage=(item:string)=>{
        const sessionItem= sessionStorage.getItem(item);
        if(sessionItem!==null){
          const originTemplate :Page = JSON.parse(sessionItem);
          const templateIndexInPages = pagesId.indexOf(originTemplate.id);
          pages.splice(templateIndexInPages,1, originTemplate);
          sessionStorage.removeItem(item);
        }
      };
      restorePage("originTemplate");
      restorePage("originMoveTargetPage")
      return{
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId,
        pagesId:pagesId,
        trash:trash
      };
      case DELETE_TEMPLATE:
        const templateIndexInPages = pagesId.indexOf(`${action.pageId}`);
        pages.splice(templateIndexInPages,1);
        pagesId.splice(templateIndexInPages,1);
        if(templatesId!==null){
          const templageIndexInTemplates =templatesId?.indexOf(`${action.pageId}`);
          templatesId.splice(templageIndexInTemplates);
        };
      return{
        pages:pages,
        firstPagesId:firstPagesId,
        templatesId:templatesId !==null?(templatesId[0]===undefined? null : templatesId)   : templatesId,
        pagesId:pagesId,
        trash:trash
      };
    default:
      return state;
  }
};