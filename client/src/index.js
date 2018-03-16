import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';

import NavBar from './components/navbar';
import Footer from './components/footer';
import Home from './components/home';
import Login from './components/login';
import SignUp from './components/signup';
import SignOut from './components/signout';
import NewPoolRequest from './components/newpoolrequest';
import { AUTH_USER } from './actions/types';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');

if(token) {
    store.dispatch({ type: AUTH_USER });
}

ReactDOM.render(<Provider store={store}>
        <BrowserRouter>
            <div>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route exact path="/signout" component={SignOut}/>
                    <Route exact path="/poolreqs/new" component={NewPoolRequest}/>
                </Switch>
                <Footer />
            </div>
        </BrowserRouter>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
