import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { Login } from './Login';
import { bindActionCreators } from 'redux';
import { validateLocalAccessToken } from '../actions/auth';

/**
 * @file
 * This file contains all the classes and functions to provide routing
 * through the webapp.
 */

export const ROUTES = {
  AUTH: '/',
  LOGIN: '/login',
  HOME: '/home'
};

/**
 * Custom made route component that based on a condition,
 * redirects the user to a specific page or loads a specific page.
 */
const AuthRoute = ({
  condition,
  component: Component,
  redirectPath,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      condition() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: redirectPath }} />
      )
    }
  />
);

/**
 * @class
 * This class is responsible for rendering correctly the different
 * components based on the route we are currently in.
 */
class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: null,
      isValidatingToken: false
    };

    this.props.validateLocalAccessToken(localStorage.getItem('token'));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      accessToken: nextProps.accessToken,
      isValidatingToken: nextProps.isValidatingToken
    });
  }

  render() {
    return (
      <div>
        {this.state.isValidatingToken ? (
          <div>Validating local token...</div>  // TODO: will be replaced with a spinner or similar
        ) : (
          <BrowserRouter>
            <Switch>
              <AuthRoute
                exact
                condition={() => this.state.accessToken != null}
                path={ROUTES.AUTH}
                component={Home}
                redirectPath={ROUTES.LOGIN}
              />
              <AuthRoute
                exact
                condition={() => this.state.accessToken == null}
                path={ROUTES.LOGIN}
                component={Login}
                redirectPath={ROUTES.HOME}
              />
              <AuthRoute
                exact
                condition={() => this.state.accessToken != null}
                path={ROUTES.HOME}
                component={Home}
                redirectPath={ROUTES.LOGIN}
              />
            </Switch>
          </BrowserRouter>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken,
    isValidatingToken: state.auth.isValidatingToken
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      validateLocalAccessToken
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes);
