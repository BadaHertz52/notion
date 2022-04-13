import {combineReducers} from 'redux';
import notion from './notion';
import list from './list';
import user from './user';
import side from './side';

const rootReducer = combineReducers({notion , list ,user , side});

export default rootReducer ;
export type RootState = ReturnType<typeof rootReducer>;