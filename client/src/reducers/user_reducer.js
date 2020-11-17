import { LOGIN_USER } from '../actions/types';
export default (state = {}, action) => {
    console.log('action', action);
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
        default:
            return state;
    }
}