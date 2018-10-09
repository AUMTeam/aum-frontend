import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';
import { ROUTES } from '..';
import { bindActionCreators } from '../../../../../Library/Caches/typescript/3.0/node_modules/redux';
import { fakeLogin } from '../../actions/auth';

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
    this.props.fakeLogin();
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
      fakeLogin
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
