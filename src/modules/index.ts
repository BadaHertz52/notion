import {combineReducers} from 'redux';
import list from './list';
import page from './page';

const rootReducer = combineReducers({list, page});

export default rootReducer ;
export type RootSatate = ReturnType<typeof rootReducer>;