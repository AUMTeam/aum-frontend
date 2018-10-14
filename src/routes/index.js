import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { Login } from './Login';

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
      accessToken: props.accessToken
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ accessToken: nextProps.accessToken });
  }

  render() {
    return (
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
    );
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes);
