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
  parents:string[]|null,
  type: BlockType ,
  icon: string | null ,
  editTime: string 
  
} ;
export type SubBlocks ={
  blocks : Block[] |null,
  blockIdes: string[]|null
};

export  const blockSample ={
  id:`blockSample_${JSON.stringify(Date.now)}`,
  contents:"",
  subBlocks : {
    blocks : null,
    blockIdes: null
  } ,
  parents:null,
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
  parentsIdes: string[] | null 
};

export type Notion={ 
  pageIdes :string [],
  pages: Page[],
};

//action
const ADD_BLOCK ="notion/ADD_BLOCK" as const;
const EDIT_BLOCK ="notion/EDIT_BLOCK" as const;
const DELETE_BLOCK ="notion/DELETE_BLOCK" as const;
const MAKE_SUB_BLOCK="notion/MAKE_SUB_BLOCK" as const;


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
export const makeSubBlock =(pageId:string, mainBlock:Block,subBlock:Block)=> ({
  type:MAKE_SUB_BLOCK ,
  pageId:pageId,
  mainBlock:mainBlock,
  block:subBlock
});

type NotionAction = 
ReturnType<typeof addBlock> | 
ReturnType<typeof editBlock> | 
ReturnType <typeof deleteBlock>|
ReturnType <typeof makeSubBlock>
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
        blocks : [
          {
            id:"sub1_1",
            contents:"sub1_1", 
            subBlocks :{
              blocks : [{
                
                  id:"sub2_1",
                  contents:"sub2_1", 
                  subBlocks :{
                    blocks : null,
                    blockIdes: null
                  } ,
                  parents:["text", "sub1_1"],
                  type: text,
                  icon:  null ,
                  editTime: JSON.stringify(Date.now),
                }
            ],
              blockIdes: ["sub2_1"]
            } ,
            parents:["text"],
            type: text,
            icon:  null ,
            editTime: JSON.stringify(Date.now),
          },
          {
            id:"sub1_2",
            contents:"sub1_2", 
            subBlocks :{
              blocks : null,
              blockIdes: null
            } ,
            parents:["text"],
            type: text,
            icon:  null ,
            editTime: JSON.stringify(Date.now),
          }
        ],
        blockIdes: ["sub1_1", "sub1_2"]
      } ,
      parents:null,
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
      parents:null,
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
      parents:null,
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
      parents:null,
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
      parents:null,
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
      parents:null,
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
      parents:null,
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
      parents:null,
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
      parents:null,
      type: page,
      icon: "🌈" ,
      editTime: JSON.stringify(Date.now),
    }
    ],
    blockIdes:["text", 'toggle', 'todo', 'todo done', 'h1', 'h2','h3','page', 'page2'],
    subPageIdes:[],
    parentsIdes: ['1111' , '2222']
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
    parentsIdes: null
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
    parentsIdes:null
  }
]
};

export default function notion (state:Notion =initialState , action :NotionAction) :Notion{
  const pageIndex:number = state.pageIdes.indexOf(action.pageId);
  const targetPage:Page =state.pages[pageIndex];
  const  blockIndex:number = state.pages[pageIndex]?.blockIdes.indexOf(action.block.id);

  const deleteData =()=>{
    targetPage.blocks.splice(blockIndex,1);
    targetPage.blockIdes.splice(blockIndex,1);
  };

  const editData=(block:Block)=>{
    const index:number = state.pages[pageIndex]?.blockIdes.indexOf(block.id)
    targetPage.blocks.splice(index,1,block);
    console.log("edit data", targetPage.blocks);
  };

  switch (action.type) {
    case ADD_BLOCK:
      state.pages[pageIndex].blocks.splice(action.nextBlockIndex,0, action.block);
      state.pages[pageIndex].blockIdes.splice(action.nextBlockIndex,0, action.block.id);

      let newPages:Page[] = state.pages.map((page:Page)=>{
        if((page.id===targetPage.id)&&(action.block.type==="page") ){
              return{
                ...page,
                subPageIdes :state.pages[pageIndex].subPageIdes.concat(action.block.id)
              }
            }else{
              return page
            }
      });
      return {
        ...state,
        pages:newPages
      }
    case EDIT_BLOCK:
      editData(action.block);
      console.log("edit", targetPage.blocks)
      return state;

    case MAKE_SUB_BLOCK:
      editData(action.mainBlock);
      if(targetPage.blockIdes.includes(action.block.id)){
        deleteData();
      };
      console.log("make subBlock", targetPage.blocks)
      return state;

    case DELETE_BLOCK:
      deleteData();
      const targetBlock =document.getElementById(action.block.id) as Node;
      const pageContent_inner = document.getElementsByClassName("pageContent_inner")[0] as Node;
      pageContent_inner.removeChild(targetBlock);

      return state;
    default:
      return state;
  }
};