import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import ReduxStoreProvider from './redux/configureStore';
import Routes from './routes';
import * as serviceWorker from './serviceWorker';
import { configureTheme } from './theme/configureTheme';
import { changeEndpointUrl, API_ENDPOINT_URL } from './constants/api';

/**
 * @file
 * This file is the root of the application.
 * Here we are going to configure the store and
 * render the whole application from a root html element.
 */

const theme = createMuiTheme(configureTheme());

// App component that acts as the root of the webapp.
const App = () => (
  <MuiThemeProvider theme={theme}>
    <SnackbarProvider
      maxSnack={4}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
    >
      <ReduxStoreProvider>
        <Routes />
      </ReduxStoreProvider>
    </SnackbarProvider>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

// If we are in development build, with Ctrl+E we can change the API endpoint URL for testing purposes
if (process.env.NODE_ENV === 'development') {
  window.onkeypress = event => {
    if (event.ctrlKey && event.key === 'e') {
      event.preventDefault();
      const newApiAddress = prompt("Inserisci il nuovo indirizzo dell'API endpoint:", API_ENDPOINT_URL);
      if (newApiAddress != null) changeEndpointUrl(newApiAddress);
    }
  };
}
