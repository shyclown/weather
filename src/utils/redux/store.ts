import {createStore, applyMiddleware, compose, Store} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?: typeof compose
    }
}

let composeEnhancers;

if (
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
} else {
    composeEnhancers = compose;
}

const enhancer = composeEnhancers(
    applyMiddleware(thunk),
    // other store enhancers if any
);

const store: Store = createStore(
    rootReducer,
    enhancer
);
export default store;