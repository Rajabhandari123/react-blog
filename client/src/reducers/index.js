import { combineReducers, createStore } from 'redux';
import user from './user_reducer';
import chats from './chat_reducer';


const rootReducer = combineReducers({
    user,
    chats
})

export default rootReducer;