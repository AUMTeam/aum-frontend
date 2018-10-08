import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import './App.css';
import { Navigation } from './components/Navigation';
import Button from 'react-materialize/lib/Button';

class App extends Component {
  constructor(props) {
    super(props);

    this.onLoginButtonPressed = this.onLoginButtonPressed.bind(this);
  }

  componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <div>
        <Route path="/login" component={Navigation} />
        <Button className="red" onClick={this.onLoginButtonPressed}>
          Vai alla login
        </Button>
      </div>
    );
  }

  onLoginButtonPressed() {
    window.open('/login', '_self');
  }
}

const mapStateToProps = state => {};

const mapDispatchToProps = dispatch => {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
