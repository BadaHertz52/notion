const ADD_FAVORITES ="user/ADD_FAVORITES" as const ;
const REMOVE_FAVORITES ="user/REMOVE_FAVORITES" as const ;
const ADD_RECENT_PAGE ="user/ADD_RECENT_PAGE" as const;
const CLEAN_RECENT_PAGE ="user/CLEAN_RECENT_PAGE" as const;

export const add_favorites =(itemId:string)=>({
  type:ADD_FAVORITES,
  itemId :itemId
});
export const remove_favorites =(itemId:string)=>({
  type:REMOVE_FAVORITES,
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
  recentPagesId:string[]|null,
};
type UserAction = ReturnType<typeof add_favorites >|
ReturnType<typeof remove_favorites>|
ReturnType<typeof add_recent_page>|
ReturnType<typeof clean_recent_page>;

const initialState :UserState ={
  userName:"badahertz52",
  userEmail:"badahertz52@notion.com",
  favorites:["12345"],
  recentPagesId:null
};

export default function user (state:UserState =initialState, action:UserAction):UserState{
  switch (action.type) {
    case ADD_FAVORITES :
      const favorites =state.favorites !==null? 
      state.favorites.concat(action.itemId) : 
      [action.itemId];
      return {
        ...state,
        favorites: favorites
      }
        ;
    case REMOVE_FAVORITES :
      const newFavorites = state.favorites?.filter((id:string)=> id !== action.itemId);

      return {
        ...state,
        favorites:
        newFavorites !==undefined?
        ( newFavorites[0]!==undefined? 
          newFavorites :
          null
        )
        :
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