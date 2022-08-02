import catImg from '../assests/img/michael-sum-LEpfefQf4rU-unsplash.jpg' ;
import imgBlockImg from '../assests/img/roses-gfcb7dbdd4_640.jpg';
import { Emoji, emojis } from '../components/IconPoup';
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
  fontWeight: "bold"|"initial",
  fontStyle: "italic" | "initial",
  textDeco : "underline"|"line-through" | "none" ,
  width: undefined | string,
  height :undefined | string
};
export const basicBlockStyle:BlockStyle ={
  color: defaultColor,
  bgColor: bg_default,
  fontWeight:"initial",
  fontStyle:"initial",
  textDeco:"none",
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

export type Page ={
  id:string ,  // 형식 : comment_현재 시간 
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
type TrashPage =Page &{
  subPages:Page[]|null
};
export const  pageSample:Page ={
  id:editTime, 
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
  firstPagesId: string[]
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
const RAISE_BLOCK="notion/RAISE_BLOCK" as const; //cancle tab

const ADD_PAGE ="notion/ADD_PAGE" as const;
const DUPLICATE_PAGE ="notion/DUPLICATE_PAGE" as const;
const EDIT_PAGE ="notion/EDIT_PAGE" as const;
const MOVE_PAGE_TO_PAGE ="notion/MOVE_PAGE_TO_PAGE" as const;
const DELETE_PAGE ="notion/DELETE_PAGE" as const;
const RESTORE_PAGE ="notion/RESTORE_PAGE" as const ;
const CLEAN_TRASH ="notion/CLEAN_TRASH" as const ;

export const add_block =(pageId:string, block:Block ,newBlockIndex:number ,previousBlockId:string|null)=> ({
  type:ADD_BLOCK ,
  pageId:pageId,
  block:block,
  newBlockIndex :newBlockIndex,
  previousBlockId:previousBlockId // enter시에 기준이 된 block이 subBlock 일 경우 넣어주기 , subBlock 으로 추가시 첫번째 sub 으로 되는지, 다음 sub 인지 결정 
});
export const edit_block =(pageId:string, block:Block)=> ({
  type:EDIT_BLOCK ,
  pageId:pageId,
  block:block,
});
export const change_block_to_page=(currentPageId: string, block:Block)=>({
  type:CHANGE_BLOCK_TO_PAGE,
  pageId: currentPageId,
  block:block,
});
export const change_page_to_block=(currentPageId: string, block:Block)=>({
  type:CHANGE_PAGE_TO_BLOCK,
  pageId: currentPageId,
  block:block,
});
export const delete_block =(pageId:string, block:Block, isInMenu:boolean)=> ({
  type:DELETE_BLOCK ,
  pageId:pageId,
  block:block,
  isInMenu:isInMenu
});

export const change_to_sub =(pageId:string, block:Block ,newParentBlockId:string)=> ({
  type:CHANGE_TO_SUB_BLOCK ,
  pageId:pageId,
  block:block,
  newParentBlockId:newParentBlockId
});

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
export const restore_page=(pageId:string)=>(
  {
    type:RESTORE_PAGE,
    pageId:pageId,
    block:null
  }
)
export const clean_trash =(pageId:string)=>({
  type: CLEAN_TRASH,
  pageId:pageId,
  block:null,
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
ReturnType <typeof clean_trash>
;

//reducer
const initialState :Notion ={
  pagesId:['12345','page1','page2' ,'1234', '123' ],
  firstPagesId :['12345' ,'1234', '123'],
  pages:[
    {
    id: '12345',
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
        fontWeight:"bold",
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
      style :basicBlockStyle,
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
        textDeco:"underline"
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
      contents:"header1", 
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
      icon: emojis[3] ,
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
    id:"numlist",
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
  }
],
  trash:{
    pagesId:null,
    pages:null
  }
};

export function findBlock( page:Page,blockId: string):{index: number ,BLOCK:Block} {
  const index = page.blocksId.indexOf(blockId) as number;
  const block:Block = page.blocks[index];

  return {
    index: index,
    BLOCK:block,
  }
};

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
export default function notion (state:Notion =initialState , action :NotionAction) :Notion{
  const pagesId = [...state.pagesId];
  const firstPagesId=[...state.firstPagesId];
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
    console.log("editBlockData", block, targetPage);
  };
  //subBlock 추가 시 parentBlock update
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
  const findPreviousBlockInDoc =(page:Page ,block :Block):{previousBlockInDoc:Block,
  previousBlockInDocIndex: number}=>{
    const editableDoc = document.getElementById(`block_${block.id}`)?.parentElement?.parentElement as HTMLElement; 
      const previouseBlockElement = editableDoc.previousElementSibling;

      const findPreviousBlockId =():string=>{
        let previousBlockId =""; 
        if(previouseBlockElement ==null && block.parentBlocksId!==null){
          const length =block.parentBlocksId.length as number;
          previousBlockId =block.parentBlocksId[length-1];
        }
        if(previouseBlockElement!==null){
          const previousBlockDom =previouseBlockElement.firstChild?.firstChild  as HTMLElement;
          previousBlockId =previousBlockDom.getAttribute("id")?.slice(6) as string;
          
        };
        return previousBlockId ;
      };
      const previousBlockId = findPreviousBlockId();
      const BLOCK= findBlock( page,previousBlockId).BLOCK;
      const previousBlockInDoc =(BLOCK.subBlocksId ===null|| (BLOCK.subBlocksId !==null && BLOCK.subBlocksId.includes(block.id)))? BLOCK :
      findBlock(page,BLOCK.subBlocksId[BLOCK.subBlocksId.length -1]).BLOCK;
      console.log("predoc,",previousBlockId, previousBlockInDoc.id)
      const previousBlockInDocIndex = page.blocksId.indexOf(previousBlockInDoc.id);
      return {
        previousBlockInDoc:previousBlockInDoc,
        previousBlockInDocIndex:previousBlockInDocIndex
      }

  };
  const editFirstBlocksId=(page:Page, block:Block)=>{
    if(block.firstBlock !==null && page.firstBlocksId!==null){
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
  const updateNewParentAndFirstBlocksIdAfterRaise= (page:Page, block:Block)=>{
    //block 삭제시subBlock이 땡겨질 경우 적용 
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
        targetPage.blocks =[action.block];
        targetPage.blocksId=[action.block.id];
      }else{
        targetPage.blocks?.splice(action.newBlockIndex, 0, action.block);
        targetPage.blocksId?.splice(action.newBlockIndex, 0, action.block.id);
      }

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
        // subBlock을 가지는 블록을 기준을  그 다음 블록으로 만들어진 경우  
        const previousBlock = findBlock(targetPage, action.previousBlockId).BLOCK;
        previousBlock.subBlocksId =null;

        action.block.subBlocksId.forEach((id:string)=>{
          const BLOCK = findBlock(targetPage, id).BLOCK;
          const parentIndex= BLOCK.parentBlocksId?.indexOf(action.previousBlockId as string);
          parentIndex !==undefined &&
          BLOCK.parentBlocksId?.splice(parentIndex,1, action.block.id);
        })
      };

      sessionStorage.setItem("newBlock", action.block.id);
      if(action.block.type ==="page"){
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
      }
      console.log( "addBlock", targetPage)
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId,
        trash:trash
      }; 
    case EDIT_BLOCK:
      editBlockData(blockIndex, action.block);
      console.log("edit",action.block  ,targetPage.blocks )
      return {
        pages:pages,
        firstPagesId:firstPagesId,
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
        pagesId:pagesId,
        trash:trash
      }; 

    case RAISE_BLOCK :
      // cursor.anchorOffset== 0 일때 backspace 를 누를때 단. targetPage의 fistBlocksId 의 첫번째 인수는 불가 
      //  1. previsouBlockInDoc 의 content 수정 
        // : actionblock 이 firstBlock 인 경우, 
        //   block 이 sub 이면서 previousblock이 같은 sub 항렬의 다른 sub 의 sub인 경우 
      // 2. action block 의 subBlock 앞으로 땡기기 
        if(targetPage.firstBlocksId!==null &&
          targetPage.firstBlocksId[0] !== action.block.id
          ){
            const targetBlock =action.block; 
            const {previousBlockInDoc , previousBlockInDocIndex}=findPreviousBlockInDoc(targetPage, action.block);
            //result1. block 위치가 한단계 앞으로  :block이 subBlock인 경우 
            //ressult2. block contents가 이전 block에 합쳐지고 block아 삭제되는 경우 
            
            const combineContents=()=>{
              const editedPreBlockInDoc :Block ={
                ...previousBlockInDoc,
                contents: `${previousBlockInDoc.contents}${targetBlock.contents}`,
                editTime:editTime
              };
              editBlockData(previousBlockInDocIndex, editedPreBlockInDoc);
              targetPage.blocks.splice(blockIndex,1);
              targetPage.blocksId.splice(blockIndex,1);
              //firstBlocksId는 따로 
            };

            if(targetBlock.parentBlocksId!==null){
              //targetBlock이 subBlock 이면
              //previoust block은 targetBlock의 parentBlock이거나 다른 subBlock인 경우 밖에 없음
              const {parentBlock} =findParentBlock(targetPage, targetBlock);
              const subBlocksId =parentBlock.subBlocksId as string[];
              const length =subBlocksId.length ;
              const lastSubBlockId= subBlocksId[length -1];
              const lastSubBlock =findBlock(targetPage, lastSubBlockId).BLOCK; 
              const conditon2 = (targetBlock.parentBlocksId.length === previousBlockInDoc.parentBlocksId?.length)&&(lastSubBlock.id === targetBlock.id); 

              if((previousBlockInDoc.id === parentBlock.id)|| conditon2){
                //block -pull 
                raiseSubBlock(targetPage, action.block, false);

                const editedTargetBlock :Block ={
                  ...targetBlock,
                  parentBlocksId:parentBlock.parentBlocksId,
                  firstBlock:parentBlock.firstBlock,
                  editTime:editTime
                };
                console.log("pull", "editarget");
                editBlockData(blockIndex, editedTargetBlock);

                if(parentBlock.firstBlock){
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
              }else{
                  ///result2 
                  console.log("content combine - block is subBlock")
                raiseSubBlock(targetPage, action.block, true);
                updateNewParentAndFirstBlocksIdAfterRaise(targetPage, action.block);
                combineContents();
                parentBlock.subBlocksId =subBlocksId.filter((id:string) => id !== targetBlock.id);
              }
              
            }
            if(targetBlock.parentBlocksId==null){
              console.log("content combine")
              raiseSubBlock(targetPage, action.block, true);
              updateNewParentAndFirstBlocksIdAfterRaise(targetPage, action.block);
              combineContents();
            };
          };
        console.log("raiseBlock", pages[pageIndex]);
      return {
        pages:pages,
        firstPagesId:firstPagesId,
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
        console.log("edit page",pages);
      };
      editPage(action.newPage);

      return{
        pages:pages,
        firstPagesId:firstPagesId,
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
      }
    default:
      return state;
  }
};