import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { LogoLoader } from '../../components/LogoLoader';
import { Navigation } from '../../components/Navigation';
import { performLogoutAction } from '../../redux/actions/auth';
import { requestCurrentUserInfoAction } from '../../redux/actions/user';
import { ClientView } from '../../views/ClientView';
import { ProgrammerView } from '../../views/ProgrammerView';
import { RevisionOfficeManagerView } from '../../views/RevisionOfficeManagerView';
import { TechnicalAreaManagerView } from '../../views/TechnicalAreaManagerView';
import { ROUTES, ROUTES_PARAMS } from '../../constants/routes';
import { drawerWidth } from '../../components/Navigation/Navigation';
import { NAVIGATION_HIERARCHY } from '../../constants/navigation';

const style = theme => ({
  root: {
    display: 'flex'
  },
  content: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth + 16,
      width: `calc(100% - ${drawerWidth + 16}px)`
    }
  }
});

/**
 * @class
 * This class represents the home page of the webapp.
 * In the home page the main UI will be loaded, so we will load
 * components responsible for loading new data and inserting new data.
 */
class Home extends Component {
  constructor(props) {
    super(props);

    props.requestCurrentUserInfoAction(props.accessToken);
  }

  render() {
    const { classes, user, match } = this.props;
    return (
      <div>
        {/* We don't want the Navigation component to be rendered before we get user data*/}
        {!this.props.user.infoObtained ? (
          <LogoLoader />
        ) : (
          <div>
            <Navigation
              {...this.props}
              user={user}
              match={match}
              onLogout={() =>
                this.props.performLogoutAction(this.props.accessToken)
              }
            />
            <main className={classes.content}>{this.renderSubRoutes()}</main>
          </div>
        )}
      </div>
    );
  }

  renderSubRoutes() {
    const { user, match } = this.props;
    return (
      <Switch>
        {NAVIGATION_HIERARCHY.map((section, index) => {
          if (user.roles.includes(section.value)) {
            return (
              <Route
                key={index}
                path={`${match.url}${section.routePath}${
                  section.tabs.length > 0 ? ROUTES_PARAMS.TAB_INDEX : ''
                }`}
                component={section.component}
              />
            );
          }
        })}
      </Switch>
    );
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { performLogoutAction, requestCurrentUserInfoAction },
    dispatch
  );
};

export default withStyles(style)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);
