import { Divider } from '@material-ui/core';
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
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CodeIcon from '@material-ui/icons/Code';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FaceIcon from '@material-ui/icons/Face';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { USER_TYPE_IDS } from '../../redux/reducers/user';
import { getRandomColor } from '../../utils/colorUtils';

const tabs = [
  {
    label: 'Programmatore',
    value: USER_TYPE_IDS.PROGRAMMER,
    drawerIcon: <CodeIcon />
  },
  {
    label: 'Referente area tecnica',
    value: USER_TYPE_IDS.TECHNICAL_AREA_MANAGER,
    drawerIcon: <RecordVoiceOverIcon />
  },
  {
    label: 'Responsabile ufficio revisioni',
    value: USER_TYPE_IDS.REVISION_OFFICE_MANAGER,
    drawerIcon: <AttachMoneyIcon />
  },
  {
    label: 'Cliente',
    value: USER_TYPE_IDS.CLIENT,
    drawerIcon: <FaceIcon />
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
    margin: -12,
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
      selectedTabValue: props.user.roles[0], // we automatically select the tab corresponding to the first role of the user
      anchorEl: null,
      isDrawerOpen: false
    };

    this.renderDrawer = this.renderDrawer.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    this.renderMenu = this.renderMenu.bind(this);

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.onDrawerItemClicked = this.onDrawerItemClicked.bind(this);
    this.onTabSelectionChanged = this.onTabSelectionChanged.bind(this);
    this.onMenuButtonClicked = this.onMenuButtonClicked.bind(this);
    this.onMenuClose = this.onMenuClose.bind(this);
    this.onLogoutButtonClicked = this.onLogoutButtonClicked.bind(this);
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    return (
      <div className={classes.root}>
        {this.renderDrawer()}
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
            <Hidden smDown>
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
            </Hidden>
            {this.renderMenu()}
          </Toolbar>
          <Hidden smDown>{this.renderTabs()}</Hidden>
        </AppBar>
      </div>
    );
  }

  renderDrawer() {
    const { classes } = this.props;
    const { isDrawerOpen } = this.state;
    return (
      <Drawer open={isDrawerOpen} onClose={this.closeDrawer}>
        {/*The avatar item is outside the div to avoid drawer closing when clicking on it*/}
        <ListItem>
          <ListItemIcon>
            <Avatar className={classes.avatar}>
              {this.props.user.name.charAt(0)}
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={this.props.user.name}
            secondary={this.props.user.email}
          />
        </ListItem>

        <div
          tabIndex={0}
          role="button"
          onClick={this.closeDrawer}
          onKeyDown={this.closeDrawer}
        >
          <List className={classes.drawerItems}>
            {tabs.map((tab, index) => {
              if (this.props.user.roles.includes(tab.value))
                return (
                  <ListItem
                    key={index}
                    onClick={() => this.onDrawerItemClicked(tab.value)}
                    button
                  >
                    <ListItemIcon>{tab.drawerIcon}</ListItemIcon>
                    <ListItemText primary={tab.label} />
                  </ListItem>
                );
            })}

            <Divider />

            <ListItem onClick={this.onLogoutButtonClicked} button>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    );
  }

  renderTabs() {
    const { selectedTabValue } = this.state;
    return (
      <Tabs
        value={selectedTabValue}
        onChange={this.onTabSelectionChanged}
        scrollable
        scrollButtons="auto"
      >
        {tabs.map((tab, index) => {
          if (this.props.user.roles.includes(tab.value))
            return <Tab key={index} value={tab.value} label={tab.label} />;
        })}
      </Tabs>
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
        <ListItem>
          <ListItemIcon>
            <Avatar className={classes.avatar}>
              {this.props.user.name.charAt(0)}
            </Avatar>
          </ListItemIcon>
          <ListItemText
            inset
            primary={this.props.user.name}
            secondary={this.props.user.email}
          />
        </ListItem>
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

  openDrawer() {
    this.setState({ isDrawerOpen: true });
  }

  closeDrawer() {
    this.setState({ isDrawerOpen: false });
  }

  onDrawerItemClicked(sectionValue) {
    this.props.onSectionChanged(sectionValue);
  }

  onTabSelectionChanged(event, sectionValue) {
    this.setState({
      selectedTabValue: sectionValue
    });
    this.props.onSectionChanged(sectionValue);
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
  classes: PropTypes.object.isRequired,
  onSectionChanged: PropTypes.func.isRequired
};

export default withStyles(styles)(HomeAppBar);
