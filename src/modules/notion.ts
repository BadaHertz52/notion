
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

export type Block ={
  id:string,
  contents:string, 
  firstBlock:boolean,
  subBlocksId : string[]|null ,
  parentBlocksId: string[]|null,
  type: BlockType ,
  icon: string | null ,
  editTime: string ,
  style :{
    color: ColorType,
    bgColor: BgColorType,
    bolder: boolean,
    italicize: boolean,
    underLine:boolean,
    strike_through :boolean,
  }
} ;

export  const blockSample:Block ={
  id:`blockSample_${JSON.stringify(Date.now())}`,
  contents:"",
  firstBlock:true,
  subBlocksId:null ,
  parentBlocksId: null,
  type:text,
  icon:null,
  editTime:"",
  style :{
    color: defaultColor,
    bgColor: bg_default,
    bolder: false,
    italicize: false,
    underLine:false,
    strike_through :false,
  }
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
const RAISE_BLOCK="notion/RAISE_BLOCK" as const; //cancle tab


export const add_block =(pageId:string, block:Block ,nextBlockIndex:number ,previousBlockId:string|null)=> ({
  type:ADD_BLOCK ,
  pageId:pageId,
  block:block,
  nextBlockIndex :nextBlockIndex,
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

type NotionAction = 
ReturnType<typeof add_block> | 
ReturnType<typeof edit_block> | 
ReturnType <typeof delete_block>|
ReturnType <typeof change_to_sub>|
ReturnType < typeof raise_block>
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
      editTime: JSON.stringify(Date.now()),
      style :{
        color: defaultColor,
        bgColor: bg_default,
        bolder: false,
        italicize: false,
        underLine:false,
        strike_through :false,
      }
    },
    {
      id:"toggle",
      contents:"toggle toggle ",
      firstBlock:true,
      subBlocksId:null , 
      parentBlocksId: null,
      type: toggle,
      icon:  null ,
      editTime: JSON.stringify(Date.now()),
      style :{
        color: defaultColor,
        bgColor: bg_default,
        bolder: false,
        italicize: false,
        underLine:false,
        strike_through :false,
      }
    },{
      id:"todo",
      contents:"todo", 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: todo,
      icon:  null ,
      editTime: JSON.stringify(Date.now()),
      style :{
        color: defaultColor,
        bgColor: bg_default,
        bolder: false,
        italicize: false,
        underLine:false,
        strike_through :false,
      }
    },{
      id:"todo done",
      contents:"todo done",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: todo_done,
      icon:  null ,
      editTime: JSON.stringify(Date.now()),
      style :{
        color: defaultColor,
        bgColor: bg_default,
        bolder: false,
        italicize: false,
        underLine:false,
        strike_through :false,
      }
    },{
      id:"h1",
      contents:"header1", 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h1,
      icon:  null ,
      editTime: JSON.stringify(Date.now()),
      style :{
        color: defaultColor,
        bgColor: bg_default,
        bolder: false,
        italicize: false,
        underLine:false,
        strike_through :false,
      }
    },{
      id:"h2",
      contents:"header2",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h2,
      icon:  null ,
      editTime: JSON.stringify(Date.now()),
      style :{
        color: defaultColor,
        bgColor: bg_default,
        bolder: false,
        italicize: false,
        underLine:false,
        strike_through :false,
      }
    },{
      id:"h3",
      contents:"header3", 
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: h3,
      icon:  null ,
      editTime: JSON.stringify(Date.now()),  
      style :{
        color: defaultColor,
        bgColor: bg_default,
        bolder: false,
        italicize: false,
        underLine:false,
        strike_through :false,
      }
    },{
      id:"page1",
      contents:"page page page",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: page,
      icon:  null ,
      editTime: JSON.stringify(Date.now()),
      style :{
        color: defaultColor,
        bgColor: bg_default,
        bolder: false,
        italicize: false,
        underLine:false,
        strike_through :false,
      }
    },
    {
      id:"page2",
      contents:"page2",
      firstBlock:true,
      subBlocksId:null ,
      parentBlocksId: null,
      type: page,
      icon: "🌈" ,
      editTime: JSON.stringify(Date.now()),
      style :{
        color: defaultColor,
        bgColor: bg_default,
        bolder: false,
        italicize: false,
        underLine:false,
        strike_through :false,
      }
    },
    {id:"sub1_1",
    contents:"sub1_1", 
    firstBlock:false,
    subBlocksId: ["sub2_1"],
    parentBlocksId: ["text"],
    type: text,
    icon:  null ,
    editTime: JSON.stringify(Date.now()),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      bolder: false,
      italicize: false,
      underLine:false,
      strike_through :false,
    }
  },
  {
    id:"sub1_2",
    contents:"sub1_2", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: ["text"],
    type: text,
    icon:  null ,
    editTime: JSON.stringify(Date.now()),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      bolder: false,
      italicize: false,
      underLine:false,
      strike_through :false,
    }
  },
  {
    id:"sub2_1",
    contents:"sub2_1", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: ["text", "sub1_1"],
    type: text,
    icon:  null ,
    editTime: JSON.stringify(Date.now()),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      bolder: false,
      italicize: false,
      underLine:false,
      strike_through :false,
    }
  },
  {
    id:"numlist",
    contents:"", 
    firstBlock:true,
    subBlocksId:["num1", "num2", "num3"],
    parentBlocksId: null,
    type: numberList,
    icon:  null ,
    editTime: JSON.stringify(Date.now()),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      bolder: false,
      italicize: false,
      underLine:false,
      strike_through :false,
    }
  },
  {
    id:"num1",
    contents:"n1", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: [numberList],
    type: numberList,
    icon:  null ,
    editTime: JSON.stringify(Date.now()),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      bolder: false,
      italicize: false,
      underLine:false,
      strike_through :false,
    }
  },
  {
    id:"num2",
    contents:"n2", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: [numberList],
    type: numberList,
    icon:  null ,
    editTime: JSON.stringify(Date.now()),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      bolder: false,
      italicize: false,
      underLine:false,
      strike_through :false,
    }
  },
  {
    id:"num3",
    contents:"n3", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId: [numberList],
    type: numberList,
    icon:  null ,
    editTime: JSON.stringify(Date.now()),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      bolder: false,
      italicize: false,
      underLine:false,
      strike_through :false,
    }
  },
  {
    id:"bulletList",
    contents:"", 
    firstBlock:true,
    subBlocksId:["b1", "b2"],
    parentBlocksId:null,
    type: bulletList,
    icon:  null ,
    editTime: JSON.stringify(Date.now()),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      bolder: false,
      italicize: false,
      underLine:false,
      strike_through :false,
    }
  },
  {
    id:"b1",
    contents:"b1", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId:[bulletList],
    type: bulletList,
    icon:  null ,
    editTime: JSON.stringify(Date.now()),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      bolder: false,
      italicize: false,
      underLine:false,
      strike_through :false,
    }
  },
  {
    id:"b2",
    contents:"b2", 
    firstBlock:false,
    subBlocksId:null,
    parentBlocksId:[bulletList],
    type: bulletList,
    icon:  null ,
    editTime: JSON.stringify(Date.now()),
    style :{
      color: defaultColor,
      bgColor: bg_default,
      bolder: false,
      italicize: false,
      underLine:false,
      strike_through :false,
    }
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

export default function notion (state:Notion =initialState , action :NotionAction) :Notion{
  const pagesId = [...state.pagesId];
  const firstPagesId=[...state.firstPagesId];
  const pages =[...state.pages];

  const pageIndex:number = pagesId.indexOf(action.pageId) as number;
  const targetPage:Page =pages[pageIndex] ;
  const  blockIndex:number = pages[pageIndex]?.blocksId.indexOf(action.block.id) as number;

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
  const deleteData =(block :Block ,targetIndex:number)=>{
    if(block.subBlocksId !==null ){
    // block.suBlocksId를 이전 block의 subBlocks로 옮기기
    const blockDoc = document.getElementById(block.id) as HTMLElement; 
    const previousBlockId = blockDoc.previousElementSibling?.id as string ;
    const {index, BLOCK}= findBlock( targetPage,previousBlockId);
    const previousBlockIndex =index;
    const previousBlock =BLOCK;

    const editedPreviousBlock :Block ={
      ...previousBlock,
      editTime: JSON.stringify(Date.now()),
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
            editTime: JSON.stringify(Date.now())
          };
          editBlockData(parentBlockIndex, newParentBlock);
          deleteData(action.block, blockIndex );

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
            editTime: JSON.stringify(Date.now())
          };
          
          editBlockData(index, newPrevisousBlock);
        };
        // action.block data 지우기 
        deleteData(action.block, blockIndex);
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
            deleteData(parentBlock , parentBlockIndex);
          }else {
            editBlockData(parentBlockIndex, {
              ...parentBlock,
              subBlocksId:null
            })
          }
          
        }
      };
      deleteData(action.block , blockIndex);

      console.log("delete", {pages:pages[pageIndex]});
      return {
        pages:pages,
        firstPagesId:firstPagesId,
        pagesId:pagesId
      };

    default:
      return state;
  }
};