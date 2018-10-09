import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';
import { ROUTES } from '..';
import { bindActionCreators } from '../../../../../Library/Caches/typescript/3.0/node_modules/redux';
import { fakeLogout } from '../../actions/auth';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: props.accessToken
    };

    this.onLogoutButtonClicked = this.onLogoutButtonClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accessToken == null) {
      this.props.history.push(ROUTES.LOGIN);
      this.setState({ accessToken: nextProps.accessToken });
    }
  }

  render() {
    return (
      <div>
        <h1>Home</h1>
        {this.state.accessToken ? (
          <h5>Logged in with access token: {this.state.accessToken}</h5>
        ) : null}
        <Button onClick={this.onLogoutButtonClicked}>LOGOUT</Button>
      </div>
    );
  }

  onLogoutButtonClicked() {
    this.props.fakeLogout();
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
      fakeLogout
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
