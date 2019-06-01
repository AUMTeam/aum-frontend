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
import { DESKTOP_DRAWER_WIDTH, getSectionsForUserRoles } from '../../constants/navigation';
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
      isDrawerOpen: false
    };
  }

  render() {
    const { classes } = this.props;
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

          {this.renderTabsRoutes()}
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

  renderTabsRoutes = () => {
    const { user, match } = this.props;

    return getSectionsForUserRoles(user.roles).map((section, index) => {
      if (section.tabs.length > 0) {
        return (
          <Route
            key={index}
            path={`${match.url}${section.routePath}${ROUTE_PARAM.TAB_VALUE}`}
            render={routeProps => (
              <InnerTabs {...routeProps} sectionUrl={`${match.url}${section.routePath}`} tabs={section.tabs} />
            )}
          />
        );
      }
    })
  };

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
    const { classes, match, location, user, onLogout } = this.props;
    return (
      <>
        {/* Avatar item is outside the div to avoid drawer closing when clicking on it */}
        <ListItem>
          <ListItemIcon>
            <Avatar className={classes.avatar}>{user.name.charAt(0)}</Avatar>
          </ListItemIcon>
          <ListItemText primary={user.name} secondary={user.email} />
        </ListItem>

        <div tabIndex={0} role="button" onClick={this.closeDrawer} onKeyDown={this.closeDrawer}>
          <List className={classes.drawerItems}>
            {getSectionsForUserRoles(user.roles).map((section, index) => {
              return (
                <ListItem
                  key={index}
                  button
                  selected={location.pathname.startsWith(`${match.url}${section.routePath}`)}
                  onClick={() =>
                    this.onSectionClicked(
                      section.tabs.length > 0
                        ? `${match.url}${section.routePath}/${section.tabs[0].value}`
                        : `${match.url}${section.routePath}`
                    )
                  }
                >
                  <ListItemIcon>{section.drawerIcon}</ListItemIcon>
                  <ListItemText primary={section.label} />
                </ListItem>
              );
            })}
            <Divider />

            <ListItem onClick={onLogout} button>
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

  onSectionClicked = url => {
    this.props.history.push(url);
  };
}

Navigation.displayName = 'Navigation';
Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default withStyles(styles)(Navigation);
