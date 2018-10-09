/**
 * @file
 * Main file of the app.
 * 
 * @author Riccardo Busetti
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import Routes from './routes';
import * as serviceWorker from './serviceWorker';
import { configureStore } from './store/configureStore';

/**
 * Configuring redux store.
 */
const store = configureStore();

/**
 * Base app component, where everything will
 * be rendered in.
 */
const App = () => (
  <Provider store={store}>
    <Routes />
  </Provider>
);

/**
 * Renders the whole app inside of the root element of the dom.
 */
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
