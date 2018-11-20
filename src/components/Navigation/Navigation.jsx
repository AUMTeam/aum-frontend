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
import { Link } from 'react-router-dom';
import { NAVIGATION_HIERARCHY } from '../../constants/navigation';
import { getRandomColor } from '../../utils/colorUtils';

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
class Navigation extends Component {
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
    this.onSectionChanged = this.onSectionChanged.bind(this);
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
    const { classes, match } = this.props;
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
            {NAVIGATION_HIERARCHY.map((section, index) => {
              if (this.props.user.roles.includes(section.value))
                return (
                  <Link to={`${match.url}${section.routePath}`}>
                    <ListItem key={index} button>
                      <ListItemIcon>{section.drawerIcon}</ListItemIcon>
                      <ListItemText primary={section.label} />
                    </ListItem>
                  </Link>
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

  onSectionChanged(routePath) {
    this.props.onSectionChanged(routePath);
  }

  onLogoutButtonClicked() {
    this.setState({ anchorEl: null });
    this.props.onLogout();
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(Navigation);
