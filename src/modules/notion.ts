
//TYPE 
const text= "text" as const ;
const toggle ="toggle" as const  ;
const todo = "todo" as const ;
const todo_done ="todo done" as const;
const h1 ="h1" as const ;
const h2 ="h2" as const ;
const h3 ="h3" as const ;
const page ="page" as const ;
const numberList ="numberList" as const;
const bulletList ="bulletList" as const ;

export type BlockType= "text"|"toggle"|"todo" |"todo done"|"h1"|"h2"|"h3" |"page" |"numberList" |"bulletList" ;

export type Block ={
  id:string,
  contents:string, 
  firstBlock:boolean,
  subBlocksId : string[]|null ,
  parentBlocksId: string[]|null,
  type: BlockType ,
  icon: string | null ,
  editTime: string 
} ;

export  const blockSample:Block ={
  id:`blockSample_${JSON.stringify(Date.now)}`,
  contents:"",
  firstBlock:true,
  subBlocksId:null ,
  parentBlocksId: null,
  type:text,
  icon:null,
  editTime:""
}
export type Page ={
  id:string , 
  header : {
    title: string | null,
    icon: string |null,
    cover: ImageData |null,
    comment: string| null,
  }
  firstBlocksId :string[] | null,
  blocks : Block[] ,  
  blocksId : string[] , 
  subPagesId:string[] | null,
  parentsId: string[] | null 
};
export const  pageSample:Page ={
  id:"", 
  header : {
    title: null,
    icon: null,
    cover: null,
    comment:  null,
  },
  firstBlocksId :null,
  blocks :  [blockSample], 
  blocksId :  [blockSample.id], 
  subPagesId: null,
  parentsId:  null 
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
const RAISE_BLOCK="notion/RAISE_BLOCK" as const;


export const addBlock =(pageId:string, block:Block ,nextBlockIndex:number ,previousBlockId:string|null)=> ({
  type:ADD_BLOCK ,
  pageId:pageId,
  block:block,
  nextBlockIndex :nextBlockIndex,
  previousBlockId:previousBlockId
});
export const editBlock =(pageId:string, block:Block)=> ({
  type:EDIT_BLOCK ,
  pageId:pageId,
  block:block,
});
export const deleteBlock =(pageId:string, block:Block)=> ({
  type:DELETE_BLOCK ,
  pageId:pageId,
  block:block
});

export const changeToSub =(pageId:string, block:Block ,first:boolean ,previousBlockId:string | null)=> ({
  type:CHANGE_TO_SUB_BLOCK ,
  pageId:pageId,
  block:block,
  first:first,
  previousBlockId:previousBlockId
});

export const raiseBlock =(pageId:string, block:Block)=>({
  type:RAISE_BLOCK,
  pageId:pageId,
  block:block
});

type NotionAction = 
ReturnType<typeof addBlock> | 
ReturnType<typeof editBlock> | 
ReturnType <typeof deleteBlock>|
ReturnType <typeof changeToSub>|
ReturnType < typeof raiseBlock>
;

//reducer
const initialState :Notion ={
  pagesId:['12345' ,'1234', '123' ],
  firstPagesId :['12345' ,'1234', '123'],
  pages:[
  {
    id: '12345',
    header : {
      title:"welcome notion",
      icon:'👋' ,
      cover: null,
      comment:  "comment test",
    },
    firstBlocksId :["text", 'toggle', 'todo', 'todo done', 'h1', 'h2','h3','page', 'page2'],
    blocks:[{
      id:"text",
      contents:"안녕", 
      firstBlock:true,
      subBlocksId: ["sub1_1", "sub1_2"] ,
      parentBlocksId: null,
      type: text,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },
    {
      id:"toggle",
      contents:"toggle toggle ",
      firstBlock:true,
      subBlocksId:null , 
      parentBlocksId: null,
      type: toggle,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"todo",
      contents:"todo", 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: todo,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"todo done",
      contents:"todo done",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: todo_done,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"h1",
      contents:"header1", 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h1,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"h2",
      contents:"header2",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h2,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"h3",
      contents:"header3", 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h3,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"page1",
      contents:"page page page",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: page,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },
    {
      id:"page2",
      contents:"page2",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: page,
      icon: "🌈" ,
      editTime: JSON.stringify(Date.now),
    },
    {id:"sub1_1",
    contents:"sub1_1", 
    firstBlock:false,
    subBlocksId: ["sub2_1"],
    parentBlocksId: ["text"],
    type: text,
    icon:  null ,
    editTime: JSON.stringify(Date.now),
  },
  {
    id:"sub1_2",
    contents:"sub1_2", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: ["text"],
    type: text,
    icon:  null ,
    editTime: JSON.stringify(Date.now),
  },
  {
    id:"sub2_1",
    contents:"sub2_1", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: ["text", "sub1_1"],
    type: text,
    icon:  null ,
    editTime: JSON.stringify(Date.now),
  },
  {
    id:"numlist",
    contents:"", 
    firstBlock:true,
    subBlocksId:["num1", "num2", "num3"],
    parentBlocksId: null,
    type: numberList,
    icon:  null ,
    editTime: JSON.stringify(Date.now),
  },
  {
    id:"num1",
    contents:"n1", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: [numberList],
    type: numberList,
    icon:  null ,
    editTime: JSON.stringify(Date.now),
  },
  {
    id:"num2",
    contents:"n2", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: [numberList],
    type: numberList,
    icon:  null ,
    editTime: JSON.stringify(Date.now),
  },
  {
    id:"num3",
    contents:"n3", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: [numberList],
    type: numberList,
    icon:  null ,
    editTime: JSON.stringify(Date.now),
  },
  {
    id:"bulletList",
    contents:"", 
    firstBlock:true,
    subBlocksId:["b1", "b2"],
    parentBlocksId:null,
    type: bulletList,
    icon:  null ,
    editTime: JSON.stringify(Date.now),
  },
  {
    id:"b1",
    contents:"b1", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId:[bulletList],
    type: bulletList,
    icon:  null ,
    editTime: JSON.stringify(Date.now),
  },
  {
    id:"b2",
    contents:"b2", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId:[bulletList],
    type: bulletList,
    icon:  null ,
    editTime: JSON.stringify(Date.now),
  },

    ],
    blocksId:["text", 'toggle', 'todo', 'todo done', 'h1', 'h2','h3','page', 'page2' , 'sub1_1' ,'sub1_2', 'sub2_1' ,"numberList" , "num1", "num2", "num3" , "bulletList", "b1", "b2"],
    subPagesId:[],
    parentsId: null,
  },
  {
    id: '1234',
    header : {
      title:"welcome notion",
      icon:'👋' ,
      cover: null,
      comment:  null,
    },
    firstBlocksId:null,
    blocks:[],
    blocksId:[],
    subPagesId:[],
    parentsId: null
  },
  {
    id: '123',
    header : {
      title:"welcome notion",
      icon:'👋' ,
      cover: null,
      comment:  null,
    },
    firstBlocksId:null,
    blocks:[],
    blocksId:[],
    subPagesId:[],
    parentsId:null
  }
]
};

export default function notion (state:Notion =initialState , action :NotionAction) :Notion{
  const pagesId = [...state.pagesId];
  const firstPagesId=[...state.firstPagesId];
  const pages =[...state.pages];

  const pageIndex:number = pagesId.indexOf(action.pageId) as number;
  const targetPage:Page =pages[pageIndex] ;
  const  blockIndex:number = pages[pageIndex]?.blocksId.indexOf(action.block.id) as number;

  const editBlockData =(index:number ,block:Block)=>{
    targetPage.blocks.splice(index,1,block);
  };
  const updateParentBlock =(subBlock:Block , previousBlockId:string|null)=>{
    if(subBlock.parentBlocksId!==null){
      //find parentBlock
        const parentBlocksId:string[] =subBlock.parentBlocksId;
        const last:number =parentBlocksId.length-1;
        const parentBlockId =parentBlocksId[last]  ;
        const parentBlockIndex:number = targetPage.blocksId.indexOf(parentBlockId);
        const parentBlock:Block = targetPage.blocks[parentBlockIndex];
        const subBlocksId = parentBlock.subBlocksId;
        const previousBlockIndex = previousBlockId=== null? -1 : subBlocksId?.indexOf(previousBlockId) as number;
        subBlocksId?.splice(previousBlockIndex+1,0,subBlock.id);
      //edit parentBlock 
        const editedParentBlock :Block={
          ...parentBlock,
          subBlocksId:subBlocksId
        };
        //update parentBlock
        targetPage.blocks.splice(parentBlockIndex,1,editedParentBlock);
    }else{
      console.log("can't find parentBlocks of this block")
    }
  };

  switch (action.type) {
    case ADD_BLOCK:
      targetPage.blocks?.splice(action.nextBlockIndex,0, action.block);
      targetPage.blocksId?.splice(action.nextBlockIndex,0, action.block.id);

      if(action.block.firstBlock){
        targetPage.firstBlocksId?.splice(action.nextBlockIndex,0,action.block.id);
      };

      //subBlock 으로 만들어 졌을 때 
      if(action.block.parentBlocksId!==null){
        updateParentBlock(action.block , action.previousBlockId);
      }

      // type 이 page로 생성된 블록 
      if(action.block.type ==="page"){
        targetPage.subPagesId?.concat(action.block.id);
        state.pagesId?.concat(action.block.id);
        const newPage ={
          ...pageSample,
          id:action.block.id, 
          header : {
            title: action.block.contents,
            icon: action.block.icon,
            cover: null,
            comment:  null,
          }
        };
        pages.concat(newPage);
      };
      console.log(targetPage.blocks)
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      }; 

    case EDIT_BLOCK:
      editBlockData(blockIndex, action.block);
      //console.log("edit", targetPage.blocks)
      return state;
    
    case CHANGE_TO_SUB_BLOCK:
      
      //1. change  subBlocksId of parentBlock which is action.block's new parentBlock
        updateParentBlock(action.block , action.previousBlockId);
      
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
         // action.block은 EDIT_BLOCK에서 수정 
      //edit previous parent block 
      if(action.block.parentBlocksId!==null){
        // find parent block 
        const parentId:string =action.block.parentBlocksId[-1];
        const newParentId:string =action.block.parentBlocksId[-2];

        const parentIndex :number= targetPage.blocksId.indexOf(parentId);
        const parentBlock:Block = targetPage.blocks[parentIndex];


        //edit parent block 
        const editedParentBlock:Block ={
          ...parentBlock,
          subBlocksId: parentBlock.subBlocksId?.filter((id:string)=> id!==action.block.id) as string[]
        };
        // update parentBlock
        targetPage.blocks.splice(parentIndex,1,editedParentBlock);

        if(parentIndex !==0){
          const newParentIndex :number =targetPage.blocksId.indexOf(newParentId);
          const newParentBlock:Block = targetPage.blocks[newParentIndex];
          const editedNewParentBlock:Block ={
            ...newParentBlock,
            subBlocksId: newParentBlock.subBlocksId?.concat(action.block.id) as string[],
          };
          targetPage.blocks.splice(newParentIndex,1,editedNewParentBlock);
        }else{
          // case: action.block.firstBlock = true;
          targetPage.firstBlocksId?.concat(action.block.id);
        }


      }else{
        console.log("can't find parentBlocks of this block")
      }
    
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      }; ;

    case DELETE_BLOCK:
      const deleteData =(block :Block)=>{
        if(block.subBlocksId !==null ){
        // block.suBlocksId를 이전 block의 subBlocks로 옮기기
        const blockDoc = document.getElementById(block.id) as HTMLElement; 
        const previousBlockId = blockDoc.previousElementSibling?.id as string ;
        const previousBlockIndex =targetPage.blocksId.indexOf(previousBlockId) as number;
        const previousBlock = targetPage.blocks[previousBlockIndex] as Block ;
        console.log(previousBlock , block)
        const editedPreviousBlock :Block ={
          ...previousBlock,
          editTime: JSON.stringify(Date.now()),
          subBlocksId:[...block.subBlocksId]
        };
        editBlockData(previousBlockIndex, editedPreviousBlock);
      };
        targetPage.blocks?.splice(blockIndex,1);
      targetPage.blocksId?.splice(blockIndex,1);

      if(block.firstBlock){
        const index:number= targetPage.firstBlocksId?.indexOf(block.id) as number;
        targetPage.firstBlocksId?.splice( index,1
        );
      };
      }
      console.log(action.block)
      if(action.block.type === "bulletList" || action.block.type ==="numberList"){
        const parentBlocksId = action.block?.parentBlocksId as string[];
        const parentBlockId :string = parentBlocksId[-1] ;
        const parentBlock = targetPage.blocks[targetPage.blocksId.indexOf(parentBlockId)] ;
        const blockIndex = parentBlock.subBlocksId?.indexOf(action.block.id) as number;
        console.log(parentBlock , blockIndex)
        if(blockIndex=== 0){
          deleteData(parentBlock);
        }
      };
      deleteData(action.block);
      console.log("delete", {pages:pages[pageIndex]});

      return {
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      }; ;
    default:
      return state;
  }
};