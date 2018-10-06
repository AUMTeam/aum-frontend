import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestLogin } from './actions/login';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.onButtonClicked = this.onButtonClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('RECEIVED ACCESS TOKEN');
  }

  render() {
    return (
      <div>
        <Button className="red" onClick={this.onButtonClicked}>
          Hello
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
