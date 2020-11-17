import axios from 'axios';
import { LOGIN_USER } from './types';

export function loginUser(dataToSubmit) {
    console.log('dataToSubmit', dataToSubmit);
    const request = axios.post('http://localhost:5000/api/user/login', dataToSubmit)
        .then(response => console.log(response))
        .error(error => console.log(error))
    return {
        type: LOGIN_USER,
        payload: request
    }
}