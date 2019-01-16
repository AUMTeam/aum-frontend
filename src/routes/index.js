import { Button, Snackbar, SnackbarContent, withTheme } from '@material-ui/core';
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
    return (
      <>
        {this.props.isValidatingToken ? (
          <LogoLoader />
        ) : (
          <HashRouter>
            <Switch>
              <AuthRoute
                condition={() => this.props.accessToken != null}
                exact
                path={ROUTE.ROOT}
                component={Home}
                redirectPath={ROUTE.LOGIN}
              />
              <AuthRoute
                condition={() => this.props.accessToken == null}
                path={ROUTE.LOGIN}
                component={Login}
                redirectPath={ROUTE.HOME}
              />
              <AuthRoute
                condition={() => this.props.accessToken != null}
                path={ROUTE.HOME}
                component={Home}
                redirectPath={ROUTE.LOGIN}
              />
            </Switch>
          </HashRouter>
        )}

        {/*
            Display a snackbar which allows the user to reload the page if there's a global uncaught error in Saga
            TODO: This will become an error screen that will prevent the app to be usable
          */}
        {this.props.globalError && (
          <Snackbar open>
            <SnackbarContent
              style={{ backgroundColor: this.props.theme.palette.error.main }}
              message="Abbiamo rilevato un errore inatteso nell'applicazione che ha portato ad una perdita di funzionalità. Per ripristinarla, ricaricare la pagina."
              anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
              action={[
                <Button style={{ color: '#ffffff' }} size="small" onClick={() => window.location.reload()}>
                  Ricarica
                </Button>
              ]}
            />
          </Snackbar>
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
  withTheme()(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Routes)
  )
);
