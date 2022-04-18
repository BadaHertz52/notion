//TYPE 
const text= "text" as const ;
const toggle ="toggle" as const  ;
const todo = "todo" as const ;
const todo_done ="todo done" as const;
const h1 ="h1" as const ;
const h2 ="h2" as const ;
const h3 ="h3" as const ;
const page ="page" as const ;

export type BlockType= "text"|"toggle"|"todo" |"todo done"|"h1"|"h2"|"h3" |"page" ;

export type Block ={
  id:string,
  contents:string, //html를 string 으로
  subBlocks : {
    blocks : Block[] |null,
    blockIdes: string[]|null
  } //toggle 을 위한 
  type: BlockType ,
  icon: string | null ,
  editTime: string 
  
} ;
export  const blockSample ={
  id:`blockSample_${JSON.stringify(Date.now)}`,
  contents:"blocksample",
  subBlocks : {
    blocks : null,
    blockIdes: null
  } ,
  type:text,
  icon:null,
  editTime:""
}
export type Page ={
  id:string, 
  header : {
    title: string,
    icon: string |null,
    cover: ImageData |null,
    comment: string| null,
  }
  blocks : Block[],
  blockIdes : string[],
  subPageIdes:string[],
  parentId: string[] | null 
};

export type Notion={ 
  pageIdes :string [],
  pages: Page[],
};

//action
const ADD_BLOCK ="notion/ADD_BLOCK" as const;
const EDIT_BLOCK ="notion/EDIT_BLOCK" as const;
const DELETE_BLOCK ="notion/DELETE_BLOCK" as const;



export const addBlock =(pageId:string, block:Block ,nextBlockIndex:number)=> ({
  type:ADD_BLOCK ,
  pageId:pageId,
  block:block,
  nextBlockIndex :nextBlockIndex
});
export const editBlock =(pageId:string, block:Block)=> ({
  type:EDIT_BLOCK ,
  pageId:pageId,
  block:block
});
export const deleteBlock =(pageId:string, block:Block)=> ({
  type:DELETE_BLOCK ,
  pageId:pageId,
  block:block
});

type NotionAction = 
ReturnType<typeof addBlock> | 
ReturnType<typeof editBlock> | 
ReturnType <typeof deleteBlock>
;

//reducer
const initialState ={
  pageIdes:['12345' ,'1234', '123' ],
  pages:[
  {
    id: '12345',
    header : {
      title:"welcome notion",
      icon:'👋' ,
      cover: null,
      comment:  "comment test",
    },
    blocks:[{
      id:"text",
      contents:"안녕", 
      subBlocks :{
        blocks : null,
        blockIdes: null
      } ,
      type: text,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"toggle",
      contents:"toggle toggle ",
      subBlocks :{
        blocks : null,
        blockIdes: null
      } , 
      type: toggle,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"todo",
      contents:"todo", 
      subBlocks :{
        blocks : null,
        blockIdes: null
      } ,
      type: todo,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"todo done",
      contents:"todo done",
      subBlocks :{
        blocks : null,
        blockIdes: null
      } ,
      type: todo_done,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"h1",
      contents:"header1", 
      subBlocks :{
        blocks : null,
        blockIdes: null
      } ,
      type: h1,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"h2",
      contents:"header2",
      subBlocks :{
        blocks : null,
        blockIdes: null
      } , 
      type: h2,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"h3",
      contents:"header3", 
      subBlocks :{
        blocks : null,
        blockIdes: null
      } ,
      type: h3,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },{
      id:"page1",
      contents:"page page page",
      subBlocks :{
        blocks : null,
        blockIdes: null
      } ,
      type: page,
      icon:  null ,
      editTime: JSON.stringify(Date.now),
    },
    {
      id:"page2",
      contents:"page2",
      subBlocks :{
        blocks : null,
        blockIdes: null
      } ,
      type: page,
      icon: "🌈" ,
      editTime: JSON.stringify(Date.now),
    }
    ],
    blockIdes:["text", 'toggle', 'todo', 'todo done', 'h1', 'h2','h3','page', 'page2'],
    subPageIdes:[],
    parentId: ['1111' , '2222']
  },
  {
    id: '1234',
    header : {
      title:"welcome notion",
      icon:'👋' ,
      cover: null,
      comment:  null,
    },
    blocks:[],
    blockIdes:[],
    subPageIdes:[],
    parentId: null
  },
  {
    id: '123',
    header : {
      title:"welcome notion",
      icon:'👋' ,
      cover: null,
      comment:  null,
    },
    blocks:[],
    blockIdes:[],
    subPageIdes:[],
    parentId:null
  }
]
};

export default function notion (state:Notion =initialState , action :NotionAction) :Notion{
  const pageIndex = state.pageIdes.indexOf(action.pageId);
  const targetPage =state.pages[pageIndex];
  switch (action.type) {
    case ADD_BLOCK:
      const page_addedBlock ={
        ...targetPage,
        blocks : state.pages[pageIndex].blocks.splice(action.nextBlockIndex,0, action.block),
        blockIdes:state.pages[pageIndex].blockIdes.splice(action.nextBlockIndex,0, action.block.id),
      } ;

      const page_addedSubPage ={
        ...page_addedBlock,
        subPageIdes :state.pages[pageIndex].subPageIdes.concat(action.block.id)
      };

      if(action.block.type==="page"){
        state.pages[pageIndex] =page_addedSubPage;
      }else{
        state.pages[pageIndex] = page_addedBlock;
      }
      
      return state
    case EDIT_BLOCK:
      let blockIndex = targetPage.blockIdes.indexOf(action.block.id);

      console.log("blockIndex", blockIndex )
      state.pages[pageIndex].blocks[blockIndex] =action.block ; 
      return state

    case DELETE_BLOCK:
      blockIndex =targetPage.blockIdes.indexOf(action.block.id);

      const newBlocks = targetPage.blocks.filter((block:Block)=> block.id !== action.block.id);

      const newBlockIdes = targetPage.blockIdes.filter((id:string )=> id !== action.block.id );

      targetPage.blocks =newBlocks ;
      targetPage.blockIdes =newBlockIdes;

      return state;
    default:
      return state;
  }
};