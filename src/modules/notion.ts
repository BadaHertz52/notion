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
  id:string, // parent/me/children
  header:string ,
  blocks : Block[],
  blockIdes : string[],
  subPageIdes:string[],
};

type Notion={ 
  pageIdes :String[],
  pages: Page[],
};

//action
const ADD_BLOCK ="notion/ADD_BLOCK" as const;
const EDIT_BLOCK ="notion/EDIT_BLOCK" as const;
const DELETE_BLOCK ="notion/DELETE_BLOCK" as const;



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

type NotionAction = 
ReturnType<typeof addBlock> | 
ReturnType<typeof editBlock> | 
ReturnType <typeof deleteBlock>
;

//reducer
const initialState ={
  pageIdes:[String(Date.now)],
  pages:[
  {
    id: String(Date.now),
    header:"",
    blocks:[],
    blockIdes:[String(Date.now)],
    subPageIdes:[],
  }
]
};

export default function notion (state:Notion =initialState , action :NotionAction){
  const pageIndex = state.pageIdes.indexOf(action.pageId);
  const targetPage =state.pages[pageIndex];
  switch (action.type) {
    case ADD_BLOCK:
      const page_addedBlock ={
        ...targetPage,
        blocks :state.pages[pageIndex].blocks.concat(action.block),
        blockIdes:state.pages[pageIndex].blockIdes.concat(action.block.id),
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