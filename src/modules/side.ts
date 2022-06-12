const lock ="lock" as const ;
const left ="left" as const ;
const close ="close" as const; 
export type SideAppear = typeof lock | typeof left | typeof close

const CHANGE_SIDE = 'side/CHANGE_SIDE' as const ;
export const change_side =(appear:SideAppear)=>({
  type:CHANGE_SIDE,
  appear:appear
});
export type Side = {
  appear:SideAppear ,
};
type SideAction = 
ReturnType<typeof change_side> 

const initialState:Side = {
  appear:lock
} ;

export default function side (state:Side = initialState, action:SideAction):Side{
  switch (action.type) {
    case CHANGE_SIDE:
      return  { appear: action.appear} ;
    default:
      return state;
  }
};
