import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getRandomColor } from '../../utils/colorUtils';
import CodeIcon from '@material-ui/icons/Code';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import FaceIcon from '@material-ui/icons/Face';

const TABS_VALUES = {
  PROGRAMMER: 0,
  TECHNICAL_AREA_MANAGER: 1,
  REVISION_OFFICE_MANAGER: 2,
  CLIENT: 3
};

const tabs = [
  {
    label: 'Programmatore',
    disabled: false,
    value: TABS_VALUES.PROGRAMMER,
    icon: <CodeIcon />
  },
  {
    label: 'Referente area tecnica',
    disabled: false,
    value: TABS_VALUES.TECHNICAL_AREA_MANAGER,
    icon: <RecordVoiceOverIcon />
  },
  {
    label: 'Responsabile ufficio revisioni',
    disabled: false,
    value: TABS_VALUES.REVISION_OFFICE_MANAGER,
    icon: <AttachMoneyIcon />
  },
  {
    label: 'Cliente',
    disabled: false,
    value: TABS_VALUES.CLIENT,
    icon: <FaceIcon />
  }
];

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  hamburgerMenu: {
    marginRight: 16
  },
  avatar: {
    margin: -8,
    backgroundColor: getRandomColor()
  },
  drawerItems: {
    width: 'auto'
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
      selectedTabValue: 0,
      anchorEl: null,
      isDrawerOpen: false
    };

    this.renderMenu = this.renderMenu.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    this.renderTabsViews = this.renderTabsViews.bind(this);
    this.renderDrawer = this.renderDrawer.bind(this);

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.onTabSelectionChanged = this.onTabSelectionChanged.bind(this);
    this.onMenuButtonClicked = this.onMenuButtonClicked.bind(this);
    this.onMenuClose = this.onMenuClose.bind(this);
    this.onLogoutButtonClicked = this.onLogoutButtonClicked.bind(this);
  }

  render() {
    const { classes } = this.props;
    const { selectedTabValue, anchorEl } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Hidden mdUp>
              <IconButton
                className={classes.hamburgerMenu}
                color="inherit"
                aria-label="Open drawer"
                onClick={this.openDrawer}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
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
            {this.renderMenu()}
          </Toolbar>
          <Hidden smDown>{this.renderTabs()}</Hidden>
        </AppBar>
        {this.renderTabsViews(selectedTabValue)}
        {this.renderDrawer()}
      </div>
    );
  }

  renderMenu() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    return (
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
            primary={this.props.user.name}
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
    );
  }

  renderTabs() {
    const { selectedTabValue } = this.state;
    return (
      <Tabs
        // FIXME: find a way to set for the 1st time the id corresponding to the first tab of the user
        value={selectedTabValue}    
        onChange={this.onTabSelectionChanged}
        scrollable
        scrollButtons="auto"
      >
        {this.props.user.role.isClient && (
          <Tab value={TABS_VALUES.CLIENT} label="Cliente" />
        )}
        {this.props.user.role.isProgrammer && (
          <Tab value={TABS_VALUES.PROGRAMMER} label="Programmatore" />
        )}
        {this.props.user.role.isRevisionOfficeManager && (
          <Tab
            value={TABS_VALUES.REVISION_OFFICE_MANAGER}
            label="Responsabile ufficio revisioni"
          />
        )}
        {this.props.user.role.isTechnicalAreaManager && (
          <Tab
            value={TABS_VALUES.TECHNICAL_AREA_MANAGER}
            label="Referente area tecnica"
          />
        )}
        {/*tabs.map((tab, index) => (
          <Tab
            key={index}
            value={tab.value}
            label={tab.label}
            disabled={tab.disabled}
          />
        ))*/}
      </Tabs>
    );
  }

  renderTabsViews(selectedTabValue) {
    switch (selectedTabValue) {
      case TABS_VALUES.PROGRAMMER:
        return <h1>Programmatore</h1>;
      case TABS_VALUES.TECHNICAL_AREA_MANAGER:
        return <h1>Referente</h1>;
      case TABS_VALUES.REVISION_OFFICE_MANAGER:
        return <h1>Responsabile uff. revisioni</h1>;
      case TABS_VALUES.CLIENT:
        return <h1>Cliente</h1>;
      default:
        return "Unknown";
    }
  }

  renderDrawer() {
    const { classes } = this.props;
    const { isDrawerOpen } = this.state;
    return (
      <Drawer open={isDrawerOpen} onClose={this.closeDrawer}>
        <div
          tabIndex={0}
          role="button"
          onClick={this.closeDrawer}
          onKeyDown={this.closeDrawer}
        >
          <List className={classes.drawerItems} component="nav">
            {tabs.map((tab, index) => (
              <ListItem key={index} button>
                <ListItemIcon>{tab.icon}</ListItemIcon>
                <ListItemText primary={tab.label} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    );
  }

  openDrawer() {
    this.setState({ isDrawerOpen: true });
  }

  closeDrawer() {
    this.setState({ isDrawerOpen: false });
  }

  onTabSelectionChanged(event, value) {
    this.setState({
      selectedTabValue: value
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
    this.props.onLogout();
  }
}

HomeAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HomeAppBar);
