const ADD_FAVORITES ="user/ADD_FAVORITES" as const ;
const DELETE_FAVORITES ="user/DELETE_FAVORITES" as const ;
const ADD_TRASH ="user/ADD_TRASH" as const ;
const CLEAN_TRASH ="user/CLEAN_TRASH" as const ;

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

export type UserState = {
  userName:string,
  userEmail:string,
  favorites:string[],
  trash:string[]
};
type UserAction = ReturnType<typeof add_favorites >|
ReturnType<typeof delete_favorites>|
ReturnType<typeof add_trash>|
ReturnType<typeof clean_trash>;

const initialState ={
  userName:"amet",
  userEmail:"amet@notion.com",
  favorites:["12345"],
  trash:[]
};

export default function user (state:UserState =initialState, action:UserAction):UserState{
  switch (action.type) {
    case ADD_FAVORITES :
      return {
        ...state,
        favorites:
        state.favorites.concat(action.itemId)}
        ;
    case DELETE_FAVORITES :
      return {
        ...state,
        favorites:state.favorites.filter((id:string)=> id !== action.itemId)
      } ;
    case ADD_TRASH :
      return {
        ...state,
        trash:state.trash.concat(action.itemId)
      } 
    case CLEAN_TRASH :
      return {
        ...state,
        trash :state.trash.filter((id:string)=> id !== action.itemId)
      } 
    default:
      return state;
  }
}