import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';
import { ROUTES } from '..';
import { bindActionCreators } from 'redux';
import { attemptLogin } from '../../actions/auth';

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
    this.props.attemptLogin("Riccardo", "12345678");
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
