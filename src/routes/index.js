import { Button, Dialog, DialogActions, DialogContent, DialogContentText, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import LogoLoader from '../components/LogoLoader';
import withErrorBoundary from '../components/WithErrorBoundary';
import { ROUTE } from '../constants/routes';
import { requestLocalTokenValidationIfPresentAction } from '../redux/actions/auth';
import Home from './Home';
import Login from './Login';

const styles = theme => ({
  errorDialog: {
    backgroundColor: theme.palette.error.dark
  },
  errorDialogText: {
    color: 'white'
  }
});

/**
 * Custom made routing component that, based on a condition,
 * redirects the user to or loads a specific page.
 */
const AuthRoute = ({ condition, component: Component, redirectPath, ...rest }) => (
  <Route
    {...rest}
    render={props => (condition() ? <Component {...props} /> : <Redirect to={{ pathname: redirectPath }} />)}
  />
);

/**
 * @class
 * This component sits at the top of the routing hierarchy of the app.
 * More specifically, it is responsible for rendering the home (and its content) when there's an active session,
 * otherwise the login page is shown.
 * It never gets unmounted.
 */
class Routes extends Component {
  constructor(props) {
    super(props);

    this.props.requestLocalTokenValidationIfPresent(localStorage.getItem('token'));
  }

  render() {
    const { isValidatingToken, accessToken, classes, globalError } = this.props;
    return (
      <>
        {isValidatingToken ? (
          <LogoLoader />
        ) : (
          <HashRouter>
            <Switch>
              <AuthRoute
                condition={() => accessToken != null}
                exact
                path={ROUTE.ROOT}
                component={Home}
                redirectPath={ROUTE.LOGIN}
              />
              <AuthRoute
                condition={() => accessToken == null}
                path={ROUTE.LOGIN}
                component={Login}
                redirectPath={ROUTE.HOME}
              />
              <AuthRoute
                condition={() => accessToken != null}
                path={ROUTE.HOME}
                component={Home}
                redirectPath={ROUTE.LOGIN}
              />
            </Switch>
          </HashRouter>
        )}

        {/* Display a dialog which forces the user to reload the page if there's a global uncaught error in Saga */}
        {globalError && (
          <Dialog classes={{ paper: classes.errorDialog }} disableBackdropClick disableEscapeKeyDown open>
            <DialogContent>
              <DialogContentText className={classes.errorDialogText}>
                Si è verificato un errore irreversibile nella back-logic dell'applicazione. Per tornare ad utilizzarla,
                ricarica la pagina.
                <br />
                Se sei uno sviluppatore, consulta la console di debug per ulteriori dettagli.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button className={classes.errorDialogText} onClick={() => window.location.reload()}>
                Ricarica
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken,
    isValidatingToken: state.auth.isValidatingToken,
    globalError: state.globalError
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      requestLocalTokenValidationIfPresent: requestLocalTokenValidationIfPresentAction
    },
    dispatch
  );
};

export default withErrorBoundary(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Routes)
  )
);
