import React, { Component } from "react";
import { Button, Navbar } from "react-materialize";
import "./App.css";
import { Navigation } from "./components/Navigation";

class App extends Component {
  render() {
    return (
      <div>
      <Navigation />
      </div>
    );
  }
}

export default App;
