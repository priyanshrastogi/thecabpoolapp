import { FETCH_POOLREQUESTS, POST_INTEREST } from '../actions/types';
import _ from 'lodash';

export default function(state = {}, action) {
    switch(action.type) {
        case FETCH_POOLREQUESTS:
            return _.mapKeys(action.payload, '_id');

        case POST_INTEREST:
            return {...state, [action.payload._id]: action.payload }

        default:
            return state

    }

    return state;
}