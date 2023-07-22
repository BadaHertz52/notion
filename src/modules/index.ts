import { combineReducers } from "redux";
import notion from "./notion/reducer";
import user from "./user/reducer";
import side from "./side/reducer";

const rootReducer = combineReducers({ notion, user, side });

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
