import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './redux/configureStore';
import Routes from './routes';
import * as serviceWorker from './serviceWorker';
import { configureTheme } from './theme/configureTheme';

/**
 * @file
 * This file is the root of the application.
 * Here we are going to configure the store and
 * render the whole application from a root html element.
 */

const store = configureStore();

const theme = createMuiTheme(configureTheme());

// App component that acts as the root of the webapp.
const App = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Routes />
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
