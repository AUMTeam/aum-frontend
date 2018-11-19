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
import { USER_TYPE_IDS } from '../../constants/user';
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

export const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  avatar: {
    margin: -12,
    backgroundColor: getRandomColor()
  },
  drawerItems: {
    width: 'auto'
  }
});

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
      isDrawerOpen: false
    };

    this.renderMobileDrawer = this.renderMobileDrawer.bind(this);
    this.renderDesktopDrawer = this.renderDesktopDrawer.bind(this);
    this.renderDrawerLayout = this.renderDrawerLayout.bind(this);

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.onDrawerItemClicked = this.onDrawerItemClicked.bind(this);
    this.onLogoutButtonClicked = this.onLogoutButtonClicked.bind(this);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.openDrawer}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Authorization Manager
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          <Hidden smUp implementation="css">
            {this.renderMobileDrawer()}
          </Hidden>
          <Hidden xsDown implementation="css">
            {this.renderDesktopDrawer()}
          </Hidden>
        </nav>
      </div>
    );
  }

  renderMobileDrawer() {
    const { isDrawerOpen } = this.state;
    return (
      <Drawer
        open={isDrawerOpen}
        variant="temporary"
        onClose={this.closeDrawer}
      >
        {/*The avatar item is outside the div to avoid drawer closing when clicking on it*/}
        {this.renderDrawerLayout()}
      </Drawer>
    );
  }

  renderDesktopDrawer() {
    return (
      <Drawer open variant="permanent" anchor="left">
        {/*The avatar item is outside the div to avoid drawer closing when clicking on it*/}
        {this.renderDrawerLayout()}
      </Drawer>
    );
  }

  renderDrawerLayout() {
    const { classes } = this.props;
    return (
      <div>
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
      </div>
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
