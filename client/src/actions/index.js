import axios from 'axios';
import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, FETCH_POOLREQUESTS, POST_INTEREST, POST_POOLREQUEST, ACCEPT_INTEREST } from './types';

const ROOT_URL = 'http://localhost:8000';

export function loginUser(cred, callback) {
    return function(dispatch) {
        axios.post(`${ROOT_URL}/users/login`, cred)
        .then( (res) => {
            dispatch({ type: AUTH_USER });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.user._id);
            callback();
        })
        .catch((error) => {
            
            if (error.request)
                dispatch({ type: AUTH_ERROR, payload: 'No Internet Connection' });
            
            else if(error.response.status == 401)
                dispatch({ type: AUTH_ERROR, payload: 'Invalid Credentials'});

        });
    }
}

export function signOutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return { type: UNAUTH_USER }
}

export function fetchPoolRequests() {
    return function(dispatch) {
        axios.get(`${ROOT_URL}/poolrequests`)
        .then((response) => {
            //console.log(response.data)
            dispatch({type: FETCH_POOLREQUESTS, payload: response.data});
        })
        .catch(() => {
            console.log("Some Error Occurred");
        })
    }
    
}

export function postPoolRequest(values, callback) {
    return function(dispatch) {
        axios.post(`${ROOT_URL}/poolrequests`, values, {
            headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
        })
        .then((response) => {
            console.log(response);
            dispatch({type: POST_POOLREQUEST, payload: response.data});
            callback();
        })
        .catch(() => {
            console.log("Some Error Occurred");
        })
    }
}

export function sendInterestRequest(poolRequestId) {
    return function(dispatch) {
        axios.post(`${ROOT_URL}/poolrequests/${poolRequestId}/interested`, null, {
            headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
        })
        .then((response) => {
            console.log(response);
            dispatch({type: POST_INTEREST, payload: response.data});
        })
        .catch(() => {
            console.log("Some Error Occurred");
        })
    }
}