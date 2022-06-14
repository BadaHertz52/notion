const ADD_FAVORITES ="user/ADD_FAVORITES" as const ;
const DELETE_FAVORITES ="user/DELETE_FAVORITES" as const ;
const ADD_TRASH ="user/ADD_TRASH" as const ;
const CLEAN_TRASH ="user/CLEAN_TRASH" as const ;
const ADD_RECENT_PAGE ="user/ADD_RECENT_PAGE" as const;
const CLEAN_RECENT_PAGE ="user/CLEAN_RECENT_PAGE" as const;

export const add_favorites =(itemId:string)=>({
  type:ADD_FAVORITES,
  itemId :itemId
});
export const delete_favorites =(itemId:string)=>({
  type:DELETE_FAVORITES,
  itemId:itemId
});

export const add_trash =(itemId:string)=>({
  type: ADD_TRASH,
  itemId:itemId
});
export const clean_trash =(itemId: string)=>({
  type: CLEAN_TRASH,
  itemId:itemId
});

export const add_recent_page =(itemId: string)=>({
  type:ADD_RECENT_PAGE,
  itemId:itemId,
});
export const clean_recent_page =()=>({
  type:CLEAN_RECENT_PAGE,
});

export type UserState = {
  userName:string,
  userEmail:string,
  favorites:string[]|null,
  trash:string[]|null,
  recentPagesId:string[]|null,
};
type UserAction = ReturnType<typeof add_favorites >|
ReturnType<typeof delete_favorites>|
ReturnType<typeof add_trash>|
ReturnType<typeof clean_trash>|
ReturnType<typeof add_recent_page>|
ReturnType<typeof clean_recent_page>;

const initialState ={
  userName:"amet",
  userEmail:"amet@notion.com",
  favorites:["12345"],
  trash:null,
  recentPagesId:null
};

export default function user (state:UserState =initialState, action:UserAction):UserState{
  switch (action.type) {
    case ADD_FAVORITES :
      return {
        ...state,
        favorites: state.favorites !==null? 
        state.favorites.concat(action.itemId) : 
        [...action.itemId]
      }
        ;
    case DELETE_FAVORITES :
      return {
        ...state,
        favorites:state.favorites !==null?
        state.favorites.filter((id:string)=> id !== action.itemId):
        null
      } ;
    case ADD_TRASH :
      return {
        ...state,
        trash:state.trash !==null?state.trash.concat(action.itemId) : [...action.itemId]
      } 
    case CLEAN_TRASH :
      return {
        ...state,
        trash :state.trash !==null?
        state.trash.filter((id:string)=> id !== action.itemId):
        null
      } ;
    case ADD_RECENT_PAGE:
      let recentPagesId ; 
      if(state.recentPagesId ==null){
        recentPagesId = [action.itemId];
      }else{
        recentPagesId =[...state.recentPagesId];
        if(state.recentPagesId.includes(action.itemId)){
          recentPagesId= recentPagesId.filter((id:string)=> id !== action.itemId);
        };
        recentPagesId.splice(0,0,action.itemId);
      };
      console.log("add recent Page", recentPagesId)
      return {
        ...state,
        recentPagesId:recentPagesId
      };
    case CLEAN_RECENT_PAGE :
      console.log("clean recent pages", {...state, recentPagesId:null});
      return {
        ...state,
        recentPagesId:null
      }
    default:
      return state;
  }
}