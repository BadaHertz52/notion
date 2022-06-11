
//TYPE 
export const text= "text" as const ;
export const toggle ="toggle" as const  ;
export const todo = "todo" as const ;
export const todo_done ="todo done" as const;
export const h1 ="h1" as const ;
export const h2 ="h2" as const ;
export const h3 ="h3" as const ;
export const page ="page" as const ;
export const numberList ="numberList" as const;
export const bulletList ="bulletList" as const ;
export const blockTypes =[text, toggle, todo, todo_done, h1, h2, page, numberList, bulletList];

export type BlockType= typeof text|typeof toggle|typeof todo |typeof todo_done|typeof h1|typeof h2|typeof h3 |typeof page |typeof numberList |typeof bulletList ;

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
  textDeco : "underline"|"line-through" | "none"
};
export const basicBlockStyle:BlockStyle ={
  color: defaultColor,
  bgColor: bg_default,
  fontWeight:"initial",
  fontStyle:"initial",
  textDeco:"none"
};
const userName= "amet";
const editTime =JSON.stringify(Date.now());

export type CommentType ={
  id: string,
  userName:string,
  content: string,
  editTime: string,
}
export type BlockCommentType = CommentType &{
  type:"open"|"resolve",
  comments:CommentType[]|null,
  commentsId : string[] |null,
};
export type Block ={
  id:string,
  contents:string, 
  firstBlock:boolean,
  subBlocksId : string[]|null ,
  parentBlocksId: string[]|null,
  type: BlockType ,
  icon: string | null ,
  editTime: string ,
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
  icon:null,
  editTime:editTime,
  style :basicBlockStyle ,
  comments:null
};
export type listItem = {
  id: string;
  title: string ;
  icon: string | null;
  subPagesId: string[]|null;
  parentsId:string[]|null;
  editTime:string
};
export type Page ={
  id:string ,  // 형식 : comment_현재 시간 
  header : {
    title: string ,
    icon: string |null,
    cover: ImageData |null,
    comments: BlockCommentType[]| null,
  }
  firstBlocksId :string[] | null,
  blocks : Block[],  
  blocksId : string[], 
  subPagesId:string[] | null,
  parentsId: string[] | null ,
  editTime: string,
};
export const  pageSample:Page ={
  id:editTime, 
  header : {
    title: "untitle",
    icon: null,
    cover: null,
    comments:  null,
  },
  firstBlocksId :null,
  blocks :  [blockSample], 
  blocksId :  [blockSample.id], 
  subPagesId: null,
  parentsId:  null ,
  editTime: editTime
};
export type Notion={ 
  pagesId :string [],
  firstPagesId: string[]
  pages: Page[],
};

//action
const ADD_BLOCK ="notion/ADD_BLOCK" as const;
const EDIT_BLOCK ="notion/EDIT_BLOCK" as const;
const DELETE_BLOCK ="notion/DELETE_BLOCK" as const;
const CHANGE_TO_SUB_BLOCK="notion/CHANGE_TO_SUB_BLOCK" as const;
const RAISE_BLOCK="notion/RAISE_BLOCK" as const; //cancle tab

const ADD_PAGE ="notion/ADD_PAGE" as const;
const DUPLICATE_PAGE ="notion/DUPLICATE_PAGE" as const;
const EDIT_PAGE ="notion/EDIT_PAGE" as const;
const DELETE_PAGE ="notion/DELETE_PAGE" as const;


export const add_block =(pageId:string, block:Block ,newBlockIndex:number ,previousBlockId:string|null)=> ({
  type:ADD_BLOCK ,
  pageId:pageId,
  block:block,
  newBlockIndex :newBlockIndex,
  previousBlockId:previousBlockId
});
export const edit_block =(pageId:string, block:Block)=> ({
  type:EDIT_BLOCK ,
  pageId:pageId,
  block:block,
});
export const delete_block =(pageId:string, block:Block)=> ({
  type:DELETE_BLOCK ,
  pageId:pageId,
  block:block
});

export const change_to_sub =(pageId:string, block:Block ,first:boolean ,newParentBlock:Block)=> ({
  type:CHANGE_TO_SUB_BLOCK ,
  pageId:pageId,
  block:block,
  first:first,
  newParentBlock:newParentBlock
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
export const delete_page =(pageId:string)=>(
{
  type:DELETE_PAGE,
  pageId: pageId,
  block:null
});

type NotionAction = 
ReturnType<typeof add_block> | 
ReturnType<typeof edit_block> | 
ReturnType <typeof delete_block>|
ReturnType <typeof change_to_sub>|
ReturnType < typeof raise_block>|
ReturnType<typeof add_page> | 
ReturnType<typeof duplicate_page>|
ReturnType<typeof edit_page> | 
ReturnType <typeof delete_page>
;

//reducer
const initialState :Notion ={
  pagesId:['12345','page1','page2' ,'1234', '123' ],
  firstPagesId :['12345' ,'1234', '123'],
  pages:[
    {
    id: '12345',
    header : {
      title:"welcome notion",
      icon:'👋' ,
      cover: null,
      comments:[{
        id:"comment_1",
        userName:userName,
        type:"open",
        content:"this is content",
        editTime: JSON.stringify(Date.parse("2021-05-20-12")
        ),
        comments:null,
        commentsId:null,
      }],
    },
    firstBlocksId :["text", 'toggle', 'todo', 'todo done', 'h1', 'h2','h3','page1', 'page2'],
    blocks:[{
      id:"text",
      contents:"안녕", 
      firstBlock:true,
      subBlocksId: ["sub1_1", "sub1_2"] ,
      parentBlocksId: null,
      type: text,
      icon:  null ,
      editTime: JSON.stringify(Date.parse("2021-5-18-15:00"))
      ,
      style :{
        color: blue,
        bgColor: bg_default,
        fontWeight:"bold",
        fontStyle:"initial",
        textDeco:"none"
      },
      comments:[{
        id:"comment_text1",
        userName:userName,
        type:"open",
        content:"hi! ☺️", 
        editTime:JSON.stringify(1654086822451),
        comments:null,
        commentsId:null,
      },]
    },
    {
      id:"toggle",
      contents:"toggle toggle ",
      firstBlock:true,
      subBlocksId:null, 
      parentBlocksId: null,
      type: toggle,
      icon:  null ,
      editTime: JSON.stringify(Date.parse("2021-5-18-16:00"))
      ,
      style :basicBlockStyle,
      comments: null
    },{
      id:"todo",
      contents:"todo", 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: todo,
      icon:  null ,
      editTime: JSON.stringify(Date.parse("2021-5-18-16:01:00")),
      style :{
        color: defaultColor,
        bgColor: bg_yellow,
        fontWeight:"initial",
        fontStyle:"initial",
        textDeco:"underline"
      },
      comments:[{
        id:"comment_todo1",
        userName:userName,
        type:"open",
        content:"todo comments", 
        editTime:JSON.stringify(Date.parse("2021-5-18-16:01:30")),
        comments:null,
        commentsId:null,
      },]
    },{
      id:"todo done",
      contents:"todo done",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: todo_done,
      icon:  null ,
      editTime: JSON.stringify(Date.parse("2021-5-19-11:30"))
      ,
      style :basicBlockStyle,
      comments:null
    },{
      id:"h1",
      contents:"header1", 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h1,
      icon:  null ,
      editTime: JSON.stringify(Date.parse("2021-5-19-12:00"))
      ,
      style :basicBlockStyle,
      comments:null
    },{
      id:"h2",
      contents:"header2",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h2,
      icon:  null ,
      editTime: JSON.stringify(Date.parse("2021-5-18-20:00"))
      ,
      style :basicBlockStyle,
      comments:null
    },{
      id:"h3",
      contents:"header3", 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h3,
      icon:  null ,
      editTime: JSON.stringify(Date.parse("2021-5-19-19:20"))
      ,  
      style :basicBlockStyle,
      comments:null
    },{
      id:"page1",
      contents:"page page page",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: page,
      icon:  null ,
      editTime: JSON.stringify(Date.parse("2021-5-20-21:00"))
      ,
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
      icon: "🌈" ,
      editTime: JSON.stringify(Date.parse("2021-5-20-9:00")),

      style :basicBlockStyle,
      comments:null
    },
    {id:"sub1_1",
    contents:"sub1_1", 
    firstBlock:false,
    subBlocksId: ["sub2_1"],
    parentBlocksId: ["text"],
    type: text,
    icon:  null ,
    editTime: JSON.stringify(Date.parse("2021-6-1-1:00")),

    style :{
      color: defaultColor,
      bgColor: bg_default,
      fontWeight:"initial",
      fontStyle:"initial",
      textDeco:"none"
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
    icon:  null ,
    editTime: JSON.stringify(Date.parse("2021-5-12-09:00"))
    ,
    style :{
      color: defaultColor,
      bgColor: bg_default,
      fontWeight:"initial",
      fontStyle:"initial",
      textDeco:"none"
    },
    comments:[{
      id:"comment_sub1_2_1",
      userName:userName,
      type:"open",
      content:"subBlock comments", 
      editTime:JSON.stringify(Date.parse("2021-5-18-8:00")),
      comments:null,
      commentsId:null,
    },]
  },
  {
    id:"sub2_1",
    contents:"sub2_1", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: ["text", "sub1_1"],
    type: text,
    icon:  null ,
    editTime: JSON.stringify(Date.parse("2021-5-27-7:00")),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      fontWeight:"initial",
      fontStyle:"initial",
      textDeco:"none"
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
    icon:  null ,
    editTime: JSON.stringify(Date.parse("2021-6-1-18:45")),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      fontWeight:"initial",
      fontStyle:"initial",
      textDeco:"none"
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
    icon:  null ,
    editTime: JSON.stringify(Date.parse("2021-6-1-19:03")),
    style :{
      color: defaultColor,
      bgColor: bg_green,
      fontWeight:"initial",
      fontStyle:"initial",
      textDeco:"underline"
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
    icon:  null ,
    editTime: JSON.stringify(Date.parse("2021-6-1-19:03:50")),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      fontWeight:"initial",
      fontStyle:"initial",
      textDeco:"none"
    },
    comments:[{
      id:"comment_n2",
      userName:userName,
      type:"open",
      content:"comment n2", 
      editTime:JSON.stringify(1654086822451),
      comments:null,
      commentsId:null,
    },]
  },
  {
    id:"num3",
    contents:"n3", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: [numberList],
    type: numberList,
    icon:  null ,
    editTime: JSON.stringify(Date.parse("2021-6-1-19:12:13")),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      fontWeight:"initial",
      fontStyle:"initial",
      textDeco:"none"
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
    icon:  null ,
    editTime: JSON.stringify(Date.parse("2021-6-1-19:13:45")),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      fontWeight:"initial",
      fontStyle:"initial",
      textDeco:"none"
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
    icon:  null ,
    editTime: JSON.stringify(Date.parse("2021-6-1-19:23")),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      fontWeight:"initial",
      fontStyle:"initial",
      textDeco:"none"
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
    icon:  null ,
    editTime: JSON.stringify(Date.parse("2021-6-1-20:12" )),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      fontWeight:"initial",
      fontStyle:"initial",
      textDeco:"none"
    },
    comments:null
  },

    ],
    blocksId:["text", 'toggle', 'todo', 'todo done', 'h1', 'h2','h3','page1', 'page2' , 'sub1_1' ,'sub1_2', 'sub2_1' ,"numberList" , "num1", "num2", "num3" , "bulletList", "b1", "b2"],
    subPagesId:['page1','page2'],
    parentsId: null,
    editTime :JSON.stringify(Date.parse("2021-5-16-15:00"))
  },
  {
    ...pageSample,
    id:"page1",
    header:{
      ...pageSample.header,
      title:"page page page"
    },
    editTime: JSON.stringify(Date.parse("2021-5-20-21:00")),
    parentsId:['12345']
  },
  {
    ...pageSample,
    id:"page2",
    header:{
      ...pageSample.header,
      icon:"🌈",
      title:"page2"
    },
    editTime: JSON.stringify(Date.parse("2021-5-20-9:00")),
    parentsId:['12345']
  },
  {
    id: '1234',
    header : {
      title:"notion2",
      icon:'👋' ,
      cover: null,
      comments:  null,
    },
    firstBlocksId:null,
    blocks:[blockSample],
    blocksId:[blockSample.id],
    subPagesId:null,
    parentsId: null,
    editTime:JSON.stringify(Date.parse("2021-5-18-19:00"))
  },
  {
    id: '123',
    header : {
      title:"notino3",
      icon:'👋' ,
      cover: null,
      comments:  null,
    },
    firstBlocksId:null,
    blocks:[blockSample],
    blocksId:[blockSample.id],
    subPagesId:null,
    parentsId:null,
    editTime:JSON.stringify(Date.parse("2021-5-13-15:00"))
  }
]
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
export const findPage =(pagesId: string[] ,pages:Page[] ,pageId:string):Page=>{
  const index :number =pagesId.indexOf(pageId);
  const PAGE :Page = pages[index];
  return PAGE
};
export default function notion (state:Notion =initialState , action :NotionAction) :Notion{
  
  const pagesId = [...state.pagesId];
  const firstPagesId=[...state.firstPagesId];
  const pages =[...state.pages];

  const pageIndex:number = pagesId.indexOf(action.pageId) as number;
  const targetPage:Page =pages[pageIndex] ;
  const  blockIndex:number = action.block !==null ?( pages[pageIndex]?.blocksId.indexOf(action.block.id) ): 0 as number;

  const editBlockData =(index:number ,block:Block)=>{
    targetPage.blocks.splice(index,1,block);
    console.log("editBlockData", block, targetPage);
  };
  //subBlock 추가 시 parentBlock update
  const updateParentBlock =(subBlock:Block , previousBlockId:string|null)=>{
    if(subBlock.parentBlocksId!==null){
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
  const deleteBlockData =(block :Block ,targetIndex:number)=>{
    if(block.subBlocksId !==null ){
    // block.suBlocksId를 이전 block의 subBlocks로 옮기기
    const blockDoc = document.getElementById(block.id) as HTMLElement; 
    const previousBlockId = blockDoc.previousElementSibling?.id as string ;
    const {index, BLOCK}= findBlock( targetPage,previousBlockId);
    const previousBlockIndex =index;
    const previousBlock =BLOCK;

    const editedPreviousBlock :Block ={
      ...previousBlock,
      editTime: editTime,
      subBlocksId:[...block.subBlocksId]
    };
    editBlockData(previousBlockIndex, editedPreviousBlock);
  };
    targetPage.blocks?.splice(targetIndex,1);
    targetPage.blocksId?.splice(targetIndex,1);
    console.log("deletedata", block);

  if(block.firstBlock){
    const index:number= targetPage.firstBlocksId?.indexOf(block.id) as number;
    targetPage.firstBlocksId?.splice( index,1
    );
  };
  };

  switch (action.type) {
    case ADD_BLOCK:
      const theNumber = action.newBlockIndex===0? 1:0;
      targetPage.blocks?.splice(action.newBlockIndex, theNumber, action.block);
      targetPage.blocksId?.splice(action.newBlockIndex, theNumber, action.block.id);

      if(action.block.firstBlock){
        targetPage.firstBlocksId?.splice(action.newBlockIndex, theNumber,action.block.id);
      };
      //subBlock 으로 만들어 졌을 때 
      if(action.block.parentBlocksId!==null){
        updateParentBlock(action.block , action.previousBlockId);
      }else{

      }
      console.log( "addBlock", targetPage.blocks)
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      }; 

    case EDIT_BLOCK:
      editBlockData(blockIndex, action.block);
      console.log("edit",action.block  ,targetPage.blocks )
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      };
    
    case CHANGE_TO_SUB_BLOCK:
      //1. change  subBlocksId of parentBlock which is action.block's new parentBlock
        const parentIndex= targetPage.blocksId.indexOf(action.newParentBlock.id);
        editBlockData(parentIndex, action.newParentBlock);
      
      //2. change actoin.block to subBlopck : edit parentsId of action.block 
      editBlockData(blockIndex, action.block);

      // first-> sub 인 경우  
      if(action.first){
        // delte  id from firstBlocksId
        const index:number = targetPage.firstBlocksId?.indexOf(action.block.id) as number;
        targetPage.firstBlocksId?.splice(index,1);
      };

      console.log("CHANGE subBlock", targetPage.blocks);
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      }; 

    case RAISE_BLOCK :
      // cursor.focusOffset== 0 일때 backspace 를 누르면 해당 block data는 삭제되고 해당 block 의 contents가 이전 block 을 붇여지는 것 

        // dom 상 이전 block 찾기 
        const {parentBlockIndex, parentBlock} =findParentBlock(targetPage, action.block);

        const subBlocksId = parentBlock.subBlocksId;
        const subBlockIndex = subBlocksId?.indexOf(action.block.id) as number;
        const newSubBlocksId = parentBlock.subBlocksId?.filter((id:string)=> id !== action.block.id) as string[]; 

        if(subBlockIndex ===0){
          const newParentBlock:Block ={
            ...parentBlock,
            contents: `${parentBlock.contents}${action.block.contents}`,
            subBlocksId : newSubBlocksId,
            editTime: editTime
          };
          editBlockData(parentBlockIndex, newParentBlock);
          deleteBlockData(action.block, blockIndex );

        }else {
          const newParentBlock :Block ={
            ...parentBlock,
            subBlocksId:newSubBlocksId
          };
          editBlockData(parentBlockIndex, newParentBlock);

          const previousSubBlockId = subBlocksId?.[subBlockIndex -1] as string ;
          const {index, BLOCK} = findBlock(targetPage, previousSubBlockId);
          const newPrevisousBlock:Block ={
            ...BLOCK,
            contents : `${BLOCK.contents}${action.block.contents}`,
            editTime: editTime
          };
          
          editBlockData(index, newPrevisousBlock);
        };
        // action.block data 지우기 
        deleteBlockData(action.block, blockIndex);
        console.log("raiseBlock",targetPage.blocks );
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      }; ;

    case DELETE_BLOCK:
      if(action.block.parentBlocksId !== null){
        const parentBlocksId = action.block?.parentBlocksId as string[];
        const parentBlockId :string = parentBlocksId[parentBlocksId.length-1] ;
        const parentBlockIndex = targetPage.blocksId.indexOf(parentBlockId);
        const parentBlock = targetPage.blocks[parentBlockIndex];
        const newSubBlocksId  = parentBlock.subBlocksId?.filter((id:string)=> id !== action.block.id) as string[] ;
        console.log(newSubBlocksId,newSubBlocksId[0]);
        if(newSubBlocksId[0] !== undefined){
          editBlockData( parentBlockIndex, {
            ...parentBlock,
            subBlocksId: newSubBlocksId
          })
        }else{

          if(action.block.type === "bulletList" || action.block.type ==="numberList"){
            deleteBlockData(parentBlock , parentBlockIndex);
          }else {
            editBlockData(parentBlockIndex, {
              ...parentBlock,
              subBlocksId:null
            })
          }
          
        }
      };
      deleteBlockData(action.block , blockIndex);

      console.log("delete", {pages:pages[pageIndex]});
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      };
    case ADD_PAGE :
      if(action.newPage.blocksId.includes("blockSample")){
        pagesId.splice(0,1);
        pages.splice(0,1);
      };
      pagesId.push(action.newPage.id);
      pages.push(action.newPage);
      if(action.newPage.parentsId==null){
        //firstPage 일경우
          firstPagesId.push(action.newPage.id);
      }else{
        const parentPage:Page = findPage(pagesId,pages,action.newPage.parentsId[action.newPage.parentsId.length-1]) ;
        const parentPageIndex = pagesId.indexOf(parentPage.id);
        const editedParentPage ={
          ...parentPage,
          subBlocksId: parentPage.subPagesId?.concat([action.newPage.id])
        };
        pages.splice(parentPageIndex,1, editedParentPage);
      };  
      console.log("add new page", pages);
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      };
    case DUPLICATE_PAGE :
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
      return{
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      }
    case EDIT_PAGE :
      pages.splice(pageIndex,1,action.newPage);
      console.log("edit page",pages);
      return{
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      };
    case DELETE_PAGE:
      pages.splice(pageIndex, 1);
      pagesId.splice(pageIndex, 1);

      if(targetPage.parentsId !==null){
        const parentPages : Page[]= targetPage.parentsId.map((id:string)=> findPage(pagesId, pages,id));

        parentPages.forEach((page:Page)=>{
          const subIndex = page.subPagesId?.indexOf(targetPage.id) as number;
          page.subPagesId?.splice(subIndex, 1);
        });
      }else{
        //firstPage 일 경우
        const index= firstPagesId.indexOf(targetPage.id);
        firstPagesId.splice(index,1);
      };

      if(targetPage.subPagesId !==null){
        targetPage.subPagesId.forEach((id:string)=>{
          const index= pagesId.indexOf(id);
          pages.splice(index,1);
          pagesId.splice(index,1);
        })
      };
      console.log("delete page", pages)
      return{
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      }
    default:
      return state;
  }
};