import React, { Component } from 'react';
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
        <LoginCard />
      </div>
    );
  }
}

export default Login;
