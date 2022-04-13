const LOCK_SIDE = 'side/LOCK_SIDE' as const ;
const LEFT_SIDE = 'side/LEFT_SIDE' as const ;
const CLOSE_SIDE = 'side/CLOSE_SIDE' as const ;
const OPEN_NEW_PAGE = 'side/OPEN_PAGE' as const ;
const CLOSE_NEW_PAGE = 'side/CLOSE_PAGE' as const ;

export const lockSide =()=>({
  type:LOCK_SIDE ,
});
export const leftSide =()=>({
  type:LEFT_SIDE ,
});
export const closeSide =()=>({
  type:CLOSE_SIDE ,
});
export const openNewPage =()=>({
  type:OPEN_NEW_PAGE ,
});
export const closeNewPage =()=>({
  type:CLOSE_NEW_PAGE ,
});

export type Side = {
  sideState: string
  // 'lock'| 'left' | 'close' ,
  newPage: boolean
};

type SideAction = 
ReturnType<typeof lockSide> |
ReturnType<typeof leftSide> |
ReturnType<typeof closeSide> |
ReturnType<typeof openNewPage>| 
ReturnType<typeof closeNewPage> ;

const initialState = {
  sideState:"lock",
  newPage: false
} ;

export default function side (state:Side = initialState, action:SideAction):Side{
  switch (action.type) {
    case LOCK_SIDE:
      return  { ...state, sideState:"lock"} ;
    case LEFT_SIDE :
      return { ...state, sideState:"left"} ;
    case CLOSE_SIDE :
      return  { ...state, sideState:"close"} ;
    case OPEN_NEW_PAGE :
      return {
        ...state,
        newPage:true
      }
    case CLOSE_NEW_PAGE :
      return {
        ...state,
        newPage:false
      } ;

    default:
      return state;
  }
};
