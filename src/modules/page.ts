//TYPE 
type Block ={
  id:string,
  contents:string, //html를 string 으로 
  type:"text"|
  "toggle"|
  "todo"|
  "header1"|
  "header2"|
  "header3" |
  "page",
  //className 
}
type Page ={
  id:string,
  header:string ,
  blocks : Block[],
  blockIdes : string[]
};
type PagesState={
  ides :String[],
  pages: Page[]
};

//action
const ADD_BLOCK ="block/ADD_BLOCK" as const;
const EDIT_BLOCK ="block/EDIT_BLOCK" as const;
const DELETE_BLOCK ="block/DELETE_BLOCK" as const;

export const addBlock =(pageId:string, block:Block)=> ({
  type:ADD_BLOCK ,
  pageId:pageId,
  block:{
    id:block.id,
    contents:block.contents,
    type:block.type
  }
});
export const editBlock =(pageId:string, block:Block)=> ({
  type:EDIT_BLOCK ,
  pageId:pageId,
  block:{
    id:block.id,
    contents:block.contents,
    type:block.type
  }
});
export const deleteBlock =(pageId:string, block:Block)=> ({
  type:DELETE_BLOCK ,
  pageId:pageId,
  block:{
    id:block.id,
    contents:block.contents,
    type:block.type
  }
});


type PageAction = 
ReturnType<typeof addBlock> | 
ReturnType<typeof editBlock> | 
ReturnType <typeof deleteBlock>
;

//reducer
const initialState ={
  ides:[String(Date.now)],
  pages:[
  {
    id: String(Date.now),
    header:"",
    blocks:[],
    blockIdes:[String(Date.now)]
  }
]
};

export default function makePage(state:PagesState =initialState , action :PageAction){
  const pageIndex = state.ides.indexOf(action.pageId);
  const targetPage =state.pages[pageIndex];
  switch (action.type) {
    case ADD_BLOCK:
      state.pages[pageIndex] ={
        ...targetPage,
        blocks :state.pages[pageIndex].blocks.concat(action.block)
      } ;
    break;

    case EDIT_BLOCK:
      let blockIndex = targetPage.blockIdes.indexOf(action.block.id);
      state.pages[pageIndex].blocks[blockIndex] =action.block ; 
    break;

    case DELETE_BLOCK:
      blockIndex =targetPage.blockIdes.indexOf(action.block.id);
      const newBlocks = targetPage.blocks.filter((block:Block)=> block.id !== action.block.id);
      const newBlockIdes = targetPage.blockIdes.filter((id:String)=> id !== action.block.id );
      targetPage.blocks =newBlocks ;
      targetPage.blockIdes =newBlockIdes;
    break;

    default:
      break;
  }
};