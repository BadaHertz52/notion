const ADD_FAVORITES ="user/ADD_FAVORITES" as const ;
const DELETE_FAVORITES ="user/DELETE_FAVORITES" as const ;
const ADD_TRASH ="user/ADD_TRASH" as const ;
const CLEAN_TRASH ="user/CLEAN_TRASH" as const ;

export const addFavorites =(listId:string)=>({
  type:ADD_FAVORITES,
  listId :listId
});
export const deleteFavorites =(listId:string)=>({
  type:DELETE_FAVORITES,
  listId:listId
});

export const addTrash =(listId: string)=>({
  type: ADD_TRASH,
  listId:listId
});
export const cleanTrash =(listId: string)=>({
  type: CLEAN_TRASH,
  listId:listId
});

type UserState = {
  userName:string,
  favorites:string[],
  trash:string[]
};
type UserAction = ReturnType<typeof addFavorites >|
ReturnType<typeof deleteFavorites>|
ReturnType<typeof addTrash>|
ReturnType<typeof cleanTrash>;

const initialState ={
  userName:"amet",
  userEmail:"amet@notion.com",
  favorites:[],
  trash:[]
};

export default function user (state:UserState =initialState, action:UserAction){
  switch (action.type) {
    case ADD_FAVORITES :
      return state.favorites.concat(action.listId);
    case DELETE_FAVORITES :
      return state.favorites.filter((id:string)=> id !== action.listId);
    case ADD_TRASH :
      return state.trash.concat(action.listId);
    case CLEAN_TRASH :
      return state.trash.filter((id:string)=> id !== action.listId)
    default:
      break;
  }
}