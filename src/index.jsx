import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { useTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';

import { LinearProgress } from '@material-ui/core';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
    Redirect,
    Link,
    withRouter,
    history,
} from 'react-router-dom';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
// import useAuthState from './firebase/useAuthState';

import { auth } from './firebase/config';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers/index';
import { setUser, clearUser } from './actions';

const store = createStore(rootReducer, composeWithDevTools());

const Routes = (props) => {
    // const [authUser, setAuthUser] = useState(null);
    const history = useHistory();

    const [newLoad, setNewLoad] = useState(true);

    useEffect(() => {
        console.log(props.isLoading);
        const unlisten = onAuthStateChanged(auth, (authUser) => {
            // authUser ? setAuthUser(authUser) : setAuthUser(null);
            authUser ? props.setUser(authUser) : setUser(null);
            console.log('USER:', authUser);
            // props.isLoading: true
            if (authUser) {
                props.setUser(authUser);
                history.push('/');
                setNewLoad(false);
                // props.isLoading(false);
            } else {
                history.push('/login');
                props.clearUser();
            }
        });

        console.log('happy s');

        return () => {
            unlisten();
        };
    }, []);

    // const authState = useAuthState(auth);

    const theme = useTheme();
    return props.isLoading ? (
        <LinearProgress />
    ) : (
        <ThemeProvider theme={theme}>
            <Switch>
                <Route exact path='/'>
                    <App />
                </Route>
                <Route path='/register'>
                    <Register />
                </Route>
                <Route path='/login'>
                    <Login />
                </Route>
                <Route path='*'>
                    <div>Error 404 not found</div>
                </Route>
            </Switch>
        </ThemeProvider>
    );
};

const mapStateFromProps = (state) => ({
    isLoading: state.user.isLoading,
});

const RootWithAuth = withRouter(
    connect(mapStateFromProps, { setUser, clearUser })(Routes)
);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <RootWithAuth />
            </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
