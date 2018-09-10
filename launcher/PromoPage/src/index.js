import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './themes';
import App from './views/App';
// import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import sagas from './sagas';

const saga = createSagaMiddleware();
const store = compose(applyMiddleware(thunk, saga))(createStore)(reducers);

saga.run(sagas);

ReactDOM.render(
    <Provider store={ store }>
  	    <App/>
    </Provider>, document.getElementById('root'));

// registerServiceWorker();
