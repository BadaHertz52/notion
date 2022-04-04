type Item ={
  id:string,
  header:string,
};

type List = Item[];

const ADD_ITEM ="list/ADD_ITEM" as const ;
const EDIT_ITEM ="list/EDIT_ITEM" as const ;
const DELETE_ITEM ="list/DELETE_ITEM" as const ;

export const addItem =(item:Item)=>({
  type:ADD_ITEM,
  item:item
});

export const editItem =(item:Item)=>({
  type:EDIT_ITEM,
  item:item
});
export const deleteItem =(item:Item)=>({
  type:DELETE_ITEM,
  item:item
});


type ListAction = 
ReturnType <typeof addItem>|
ReturnType <typeof editItem>|
ReturnType <typeof deleteItem>
;

const initialState =[{
  id:String(Date.now),
  header:"welcome notion"
}];

export default function list(state:List =initialState ,action:ListAction){
  switch (action.type) {
    case ADD_ITEM:
      return state.concat(action.item);

    case EDIT_ITEM:
      const itemIndexs = state.map(item => item.id);
      const index = itemIndexs.indexOf(action.item.id);
      state[index] = action.item ;
      break;
    
    case DELETE_ITEM :
      return state.filter((item: Item) => item.id !== action.item.id);
      
    default:
      break;
  }
}