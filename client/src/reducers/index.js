import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth'
import poolRequestsReducer from './poolrequests';

const rootReducer = combineReducers({
    form: formReducer,
    auth: authReducer,
    poolrequests: poolRequestsReducer
});

export default rootReducer;