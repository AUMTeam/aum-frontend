import React, { Component } from "react";
import { Button, Navbar } from "react-materialize";
import "./Navigation.css";

class Navigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Navbar className="black" brand="Gesbank manager" right />;
  }
}

export default Navigation;
