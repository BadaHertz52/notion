import {combineReducers} from 'redux';
import notion from './notion';
import user from './user';
import side from './side';

const rootReducer = combineReducers({notion ,user , side});

export default rootReducer ;
export type RootState = ReturnType<typeof rootReducer>;