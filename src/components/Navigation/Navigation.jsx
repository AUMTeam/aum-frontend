/* eslint-disable array-callback-return */
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
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { DESKTOP_DRAWER_WIDTH, getRouteForUser, NAVIGATION_HIERARCHY } from '../../constants/navigation';
import { ROUTE_PARAM } from '../../constants/routes';
import { getRandomColor } from '../../utils/colorUtils';
import InnerTabs from '../InnerTabs';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      marginLeft: DESKTOP_DRAWER_WIDTH,
      width: `calc(100% - ${DESKTOP_DRAWER_WIDTH})`
    }
  },
  drawer: {
    width: DESKTOP_DRAWER_WIDTH
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  toolbarTitle: {
    [theme.breakpoints.up('md')]: {
      marginLeft: 16
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
 * This class represents the base structure of the app interface (drawer, appbar and tabs)
 * and renders routes and UI elements corresponding to user roles
 */
class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDrawerOpen: false,
      selectedDrawerItem: NAVIGATION_HIERARCHY.findIndex(section => section.value === props.user.roles[0])
    };

    // Redirect the user to the view of its first role
    props.history.push(`${props.match.url}${getRouteForUser(props.user.roles[0])}`);
  }

  render() {
    const { classes, user, match } = this.props;
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Open drawer"
              onClick={this.openDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.toolbarTitle} variant="h6" color="inherit" noWrap>
              Authorization Manager
            </Typography>
          </Toolbar>

          {/* Render tabs and their corresponding routes */}
          {NAVIGATION_HIERARCHY.map((section, index) => {
            if (user.roles.includes(section.value) && section.tabs.length > 0) {
              return (
                <Route
                  key={index}
                  path={`${match.url}${section.routePath}${ROUTE_PARAM.TAB_INDEX}`}
                  render={routeProps => (
                    <InnerTabs
                      {...routeProps}
                      prevUrl={`${match.url}${section.routePath}`}
                      tabs={NAVIGATION_HIERARCHY.find(innerSection => innerSection.value === section.value).tabs}
                    />
                  )}
                />
              );
            }
          })}
        </AppBar>

        <aside>
          <Hidden mdUp implementation="css">
            {this.renderMobileDrawer()}
          </Hidden>
          <Hidden smDown implementation="css">
            {this.renderDesktopDrawer()}
          </Hidden>
        </aside>
      </div>
    );
  }

  renderMobileDrawer = () => {
    return (
      <Drawer open={this.state.isDrawerOpen} variant="temporary" onClose={this.closeDrawer}>
        {this.renderDrawerLayout()}
      </Drawer>
    );
  };

  renderDesktopDrawer = () => {
    return (
      <Drawer classes={{ paper: this.props.classes.drawer }} open variant="permanent" anchor="left">
        {this.renderDrawerLayout()}
      </Drawer>
    );
  };

  renderDrawerLayout = () => {
    const { classes, match } = this.props;
    const { selectedDrawerItem } = this.state;
    return (
      <>
        {/* Avatar item is outside the div to avoid drawer closing when clicking on it */}
        <ListItem>
          <ListItemIcon>
            <Avatar className={classes.avatar}>{this.props.user.name.charAt(0)}</Avatar>
          </ListItemIcon>
          <ListItemText primary={this.props.user.name} secondary={this.props.user.email} />
        </ListItem>

        <div tabIndex={0} role="button" onClick={this.closeDrawer} onKeyDown={this.closeDrawer}>
          <List className={classes.drawerItems}>
            {NAVIGATION_HIERARCHY.map((section, index) => {
              if (this.props.user.roles.includes(section.value))
                return (
                  <ListItem
                    key={index}
                    button
                    selected={selectedDrawerItem === index}
                    onClick={() =>
                      this.onSectionClicked(
                        section.tabs.length > 0
                          ? `${match.url}${section.routePath}/0`
                          : `${match.url}${section.routePath}`,
                        index
                      )
                    }
                  >
                    <ListItemIcon>{section.drawerIcon}</ListItemIcon>
                    <ListItemText primary={section.label} />
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
      </>
    );
  };

  openDrawer = () => {
    this.setState({ isDrawerOpen: true });
  };

  closeDrawer = () => {
    this.setState({ isDrawerOpen: false });
  };

  onSectionClicked = (url, index) => {
    this.props.history.push(url);
    this.setState({ selectedDrawerItem: index });
  };

  onLogoutButtonClicked = () => {
    this.setState({ anchorEl: null });
    this.props.onLogout();
  };
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default withStyles(styles)(Navigation);
