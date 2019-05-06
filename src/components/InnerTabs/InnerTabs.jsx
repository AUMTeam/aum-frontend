import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * @class
 * This class is responsible for displaying navigation tabs passed via props
 */
class InnerTabs extends Component {
  render() {
    const { tabs, match, width } = this.props;
    return (
      <Tabs
        value={match.params.tabValue}
        variant={isWidthDown('xs', width) ? 'fullWidth' : 'scrollable'}
        scrollButtons="auto"
      >
        {tabs.map((tab, index) => {
          return <Tab key={index} value={tab.value} label={tab.label} onClick={() => this.onTabClicked(tab.value)} />;
        })}
      </Tabs>
    );
  }

  onTabClicked = tabValue => {
    const { history, sectionUrl } = this.props;
    history.push(`${sectionUrl}/${tabValue}`);
  };
}

InnerTabs.displayName = 'InnerTabs';
InnerTabs.propTypes = {
  sectionUrl: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired
};

export default withWidth({ noSSR: true })(InnerTabs);
