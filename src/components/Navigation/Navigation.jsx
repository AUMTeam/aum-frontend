import React, { Component } from 'react';
import { Navbar } from 'react-materialize';
import './Navigation.css';

class Navigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navbar className="black" brand="Gesbank manager" right />
      </div>
    );
  }
}

export default Navigation;
