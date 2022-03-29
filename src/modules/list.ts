//ACTION 
const ADD_LIST ="list/ADD_LIST" as const ;
const EDIT_LIST ="list/EDIT_LIST" as const ;
const DELETE_LIST ="list/DELETE_LIST" as const  ; 

const ADD_PAGE ="list/ADD_PAGE" as const ;
const EDIT_PAGE ="list/EDIT_PAGE" as const ;
const DELETE_PAGE ="list/DELETE_PAGE" as const ;

export const addList = (id:string ,header:string, data:string) =>({
  type:ADD_LIST,
  list :{
    id: id ,
    header: header,
    pages:[]
  }
});
export const editList = (id:string, text : string ) =>({
  type:EDIT_LIST,
  list :{
    id:id,
    header: text,
  }
});

export const deleteList =(id:string )=>({
  type:DELETE_LIST,
  list:{
    id:id,
  }
});

export const addPage =(list:List, page:Page)=>({
  type:ADD_PAGE,
  list :list,
  page :page
});

export const editPage =(list:List, page:Page)=>({
  type:EDIT_PAGE,
  list :list,
  page :page
});
export const deletePage =(list:List, pageId:string)=>({
  type:DELETE_PAGE,
  list : list,
  page :{
    id:pageId,
  }
});
//TYPE 
type Page ={
  id:string,
  header:string ,
};
type List ={
  id:string,
  header:string,
  pages:Page[]
};

type ListState =List[];

type ListAction = 
ReturnType<typeof addList> | 
ReturnType<typeof editList> | 
ReturnType <typeof deleteList>|
ReturnType <typeof addPage>|
ReturnType <typeof editPage>|
ReturnType <typeof deletePage>
;

//REDUCER 
const initialState =[{
  id: String(Date.now),
  header :"welcome notion",
  pages:[]
}];

export default function makeList (state:ListState =initialState, action: ListAction){
  switch (action.type) {
    case ADD_LIST:
      return state.concat(action.list);
    case EDIT_LIST :
      return state.map((list :List)=>{
        if(list.id === action.list.id){
          return {...list, header:action.list.header}
        }else{
          return list
        }
      }) ;

    case DELETE_LIST :
      return state.filter((list:List) => list.id !== action.list.id);

    case ADD_PAGE :
      return state.map((list:List) => {
        if( action.list.id === list.id){
          const newList = {...list, pages:list.pages.concat(action.page)};
          return newList;
        }else{
          return list
        }
      });

    case EDIT_PAGE:
      return state.map((list:List)=>{
        if(action.list.id === list.id){
          const newPages = list.pages.map((page:Page)=>{
            if(page.id=== action.page.id){
              return {...page, header:action.page.header}
            }else{
              return page
            }
          });

          return{
            ...list, pages:newPages
          }
        }else{
          return list
        }
      });

    case DELETE_PAGE :
      return state.map ((list:List)=>{
        if(action.list.id=== list.id){
          const newPages = list.pages.filter((page:Page)=> page.id !== action.page.id);
          return {
            ...list, pages:newPages
          }
        }else{
          return list
        }
      })
    default:
      break;
  }
};

