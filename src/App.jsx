import React, { Component } from 'react';
import './App.css';
import { Navigation } from './components/Navigation';
import { Button } from 'react-materialize';

class App extends Component {
  constructor(props) {
    super(props);

    this.onButtonClicked = this.onButtonClicked.bind(this);
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
    console.log('Button clicked');
  }
}

export default App;
