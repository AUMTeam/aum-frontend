import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { attemptLogin } from '../../actions/auth';
import { LoginCard } from '../../components/LoginCard'

/**
 * @class
 * This class represents the login page of the webapp.
 * In the login page the login form will be loaded, in order to let
 * the user log into the system.
 */
class Login extends Component {
  render() {
    return (
      <div>
        <LoginCard onLoginBtnClicked={this.props.attemptLogin} />
        {/*<h1>Login</h1>
        <Button onClick={this.onLoginButtonClicked}>LOGIN</Button>*/}
      </div>
    );
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
