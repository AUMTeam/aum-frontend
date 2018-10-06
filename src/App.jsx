import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestLogin } from './actions/login';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: 'NULL'
    };

    this.onButtonClicked = this.onButtonClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ accessToken: nextProps.accessToken });
  }

  render() {
    return (
      <div>
        <Button className="red" onClick={this.onButtonClicked}>
          {this.state.accessToken}
        </Button>
      </div>
    );
  }

  onButtonClicked() {
    this.props.requestLogin();
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.login.accessToken
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      requestLogin
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
