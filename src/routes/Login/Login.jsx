import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ROUTES } from '..';
import { attemptLogin } from '../../actions/auth';

/**
 * @class
 * This class represents the login page of the webapp.
 * In the login page the login form will be loaded, in order to let
 * the user log into the system.
 */
class Login extends Component {
  constructor(props) {
    super(props);

    this.onLoginButtonClicked = this.onLoginButtonClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accessToken != null) {
      this.props.history.push(ROUTES.HOME);
    }
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <Button onClick={this.onLoginButtonClicked}>LOGIN</Button>
      </div>
    );
  }

  onLoginButtonClicked() {
    this.props.attemptLogin('admin', 'admin');
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      attemptLogin
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
