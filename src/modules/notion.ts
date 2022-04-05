//TYPE 
export type BlockType ="text"|
"toggle"|
"todo"|
"header1"|
"header2"|
"header3" |
"page" ;

export type Block ={
  id:string,
  contents:string, //html를 string 으로 
  type: BlockType,
  icon: string | null ,
  editTime: Date
  //className 
}
export type Page ={
  id:string, // parent/me/children
  header:string ,
  icon: string |null
  blocks : Block[],
  blockIdes : string[],
  subPageIdes:string[],
};

export type Notion={ 
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
  block:block
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
  pageIdes:['12345'],
  pages:[
  {
    id: '12345',
    header:"welocome notion",
    icon:"☺️" ,
    blocks:[],
    blockIdes:[],
    subPageIdes:[],
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
      
      return state
    case EDIT_BLOCK:
      let blockIndex = targetPage.blockIdes.indexOf(action.block.id);
      state.pages[pageIndex].blocks[blockIndex] =action.block ; 
      return state

    case DELETE_BLOCK:
      blockIndex =targetPage.blockIdes.indexOf(action.block.id);

      const newBlocks = targetPage.blocks.filter((block:Block)=> block.id !== action.block.id);

      const newBlockIdes = targetPage.blockIdes.filter((id:String)=> id !== action.block.id );

      targetPage.blocks =newBlocks ;
      targetPage.blockIdes =newBlockIdes;

      return state;
    default:
      return state;
  }
};