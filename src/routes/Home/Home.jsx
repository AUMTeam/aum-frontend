import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';
import { ROUTES } from '..';
import { bindActionCreators } from 'redux';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: props.accessToken
    };
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
    {},
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
