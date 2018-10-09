import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { Login } from './Login';

export const ROUTES = {
  AUTH: '/',
  LOGIN: '/login',
  HOME: '/home'
};

const AuthRoute = ({ component: Component, accessToken, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      accessToken != undefined ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: ROUTES.LOGIN }} />
      )
    }
  />
);

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
            path={ROUTES.AUTH}
            component={Home}
            accessToken={this.state.accessToken}
          />
          <Route
            exact
            path={ROUTES.HOME}
            render={props => <Home {...props} />}
          />
          <Route
            exact
            path={ROUTES.LOGIN}
            render={props => <Login {...props} />}
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
