import React, { Component } from 'react';
import { HomeAppBar } from '../../components/HomeAppBar';

/**
 * @class
 * This class represents the home page of the webapp.
 * In the home page the main UI will be loaded, so we will load
 * components responsible for loading new data and inserting new data.
 */
export default class Home extends Component {
  render() {
    return (
      <div>
        <HomeAppBar />
      </div>
    );
  }
}
