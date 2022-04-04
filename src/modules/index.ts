import {combineReducers} from 'redux';
import notion from './notion';
import list from './list';
import user from './user';

const rootReducer = combineReducers({notion , list ,user});

export default rootReducer ;
export type RootSatate = ReturnType<typeof rootReducer>;