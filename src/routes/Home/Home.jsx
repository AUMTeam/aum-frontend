import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';
import { ROUTES } from '..';
import { bindActionCreators } from 'redux';
import { performLogout } from '../../actions/auth';

/**
 * @class
 * This class represents the home page of the webapp.
 * In the home page the main UI will be loaded, so we will load
 * components responsible for loading new data and inserting new data.
 */
class Home extends Component {
  constructor(props) {
    super(props);

    this.onLogout = this.onLogout.bind(this);

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
        <Button onClick={this.onLogout}>LOGOUT</Button>
      </div>
    );
  }

  onLogout() {
    this.props.performLogout(this.state.accessToken);
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
      performLogout
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
