import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import withErrorBoundary from './components/WithErrorBoundary';
import { API_ENDPOINT_URL, changeEndpointUrl } from './constants/api';
import EnhancedStoreProvider from './redux/configureStore';
import Routes from './routes';
import { configureTheme } from './theme/configureTheme';

/**
 * @file
 * This file is the root of the application.
 * Here we are going to configure the store and
 * render the whole application from a root HTML element.
 */

const theme = createMuiTheme(configureTheme());

/**
 * Root component of the web-app
 */
const RootComponent = withErrorBoundary(function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <EnhancedStoreProvider>
          <Routes />
        </EnhancedStoreProvider>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
});

ReactDOM.render(<RootComponent />, document.getElementById('root'));

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
