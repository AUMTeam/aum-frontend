import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { attemptLogout } from '../../actions/auth';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { getRandomColor } from '../../utils/colorUtils';

const TABS_VALUES = {
  DEVELOPER_VALUE: 0,
  REFERENT_VALUE: 1,
  MANAGER_VALUE: 2,
  CUSTOMER_VALUE: 3
};

const tabs = [
  {
    label: 'Programmatore',
    disabled: false,
    value: TABS_VALUES.DEVELOPER_VALUE
  },
  {
    label: 'Referente area tecnica',
    disabled: false,
    value: TABS_VALUES.REFERENT_VALUE
  },
  {
    label: 'Responsabile ufficio revisioni',
    disabled: false,
    value: TABS_VALUES.MANAGER_VALUE
  },
  {
    label: 'Cliente',
    disabled: false,
    value: TABS_VALUES.CUSTOMER_VALUE
  }
];

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  avatar: {
    margin: -8,
    backgroundColor: getRandomColor()
  }
};

/**
 * @class
 * This class is responsible of creating the app bar of the webapp
 * with the tabs navigation system.
 */
class HomeAppBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: 0,
      anchorEl: null
    };

    this.onTabSelectionChanged = this.onTabSelectionChanged.bind(this);
    this.onMenuButtonClicked = this.onMenuButtonClicked.bind(this);
    this.onMenuClose = this.onMenuClose.bind(this);
    this.onLogoutButtonClicked = this.onLogoutButtonClicked.bind(this);
  }

  render() {
    const { classes } = this.props;
    const { selectedValue, anchorEl } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Authorization manager
            </Typography>
            <IconButton
              className={classes.button}
              color="inherit"
              aria-label="Toolbar menu"
              aria-owns={anchorEl ? 'toolbar-menu' : null}
              aria-haspopup="true"
              onClick={this.onMenuButtonClicked}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="toolbar-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.onMenuClose}
            >
              <MenuItem onClick={() => console.log('Profile clicked')}>
                <ListItemIcon>
                  <Avatar className={classes.avatar}>A</Avatar>
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.primary }}
                  inset
                  primary="Admin"
                />
              </MenuItem>
              <MenuItem onClick={this.onLogoutButtonClicked}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.primary }}
                  inset
                  primary="Logout"
                />
              </MenuItem>
            </Menu>
          </Toolbar>
          <Tabs
            value={selectedValue}
            onChange={this.onTabSelectionChanged}
            scrollable
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                value={tab.value}
                label={tab.label}
                disabled={tab.disabled}
              />
            ))}
          </Tabs>
        </AppBar>
        {this.renderTabsViews(selectedValue)}
      </div>
    );
  }

  renderTabsViews(selectedValue) {
    switch (selectedValue) {
      case TABS_VALUES.DEVELOPER_VALUE:
        return <h1>Programmatore</h1>;
      case TABS_VALUES.REFERENT_VALUE:
        return <h1>Referente</h1>;
      case TABS_VALUES.MANAGER_VALUE:
        return <h1>Responsabile</h1>;
      case TABS_VALUES.CUSTOMER_VALUE:
        return <h1>Cliente</h1>;
      default:
        return <h1>Programmatore</h1>;
    }
  }

  onTabSelectionChanged(event, value) {
    this.setState({
      selectedValue: value
    });
  }

  onMenuButtonClicked(event) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  onMenuClose() {
    this.setState({ anchorEl: null });
  }

  onLogoutButtonClicked() {
    this.setState({ anchorEl: null });
    this.props.attemptLogout(this.props.accessToken);
  }
}

HomeAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ attemptLogout }, dispatch);
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomeAppBar)
);
