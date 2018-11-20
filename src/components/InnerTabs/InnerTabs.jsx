import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * @class
 * This class is responsible of displaying inner tabs for
 * each member.
 */
export default class InnerTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTabValue: 0
    };

    console.log(props);

    this.onTabChanged = this.onTabChanged.bind(this);
    this.onTabClicked = this.onTabClicked.bind(this);
  }

  render() {
    const { tabs } = this.props;
    const { selectedTabValue } = this.state;
    return (
      <Tabs
        value={selectedTabValue}
        scrollable
        scrollButtons="auto"
        onChange={this.onTabChanged}
      >
        {tabs.map((tab, index) => {
          return (
            <Tab
              key={index}
              value={tab.value}
              label={tab.label}
              onClick={() => this.onTabClicked(tab.value)}
            />
          );
        })}
      </Tabs>
    );
  }

  onTabChanged(event, value) {
    this.setState({ selectedTabValue: value });
  }

  onTabClicked(value) {
    const { history, prevUrl } = this.props;

    history.push(`${prevUrl}/${value}`);
  }
}

InnerTabs.PropTypes = {
  prevUrl: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired
};
