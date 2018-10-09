/**
 * @file
 * All the routing in the app is described here.
 *
 * @author Riccardo Busetti
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { Login } from './Login';

/**
 * Different routes in the app.
 */
export const ROUTES = {
  AUTH: '/',
  LOGIN: '/login',
  HOME: '/home'
};

/**
 * Custom made route component that based on a condition,
 * redirects the user to a specific page or loads a specific page.
 *
 * @param {*} param0 parameters of the component
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
 * Routes component, responsible about defining the dynamic flow
 * of in-app routing.
 *
 * @author Riccardo Busetti
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

const mapDispatchToProps = dispatch => {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes);
