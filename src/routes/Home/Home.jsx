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
import { ROUTES } from '../../constants/routes';
import { drawerWidth } from '../../components/Navigation/Navigation';

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
        {/* We don't want the appBar to be rendered before we get user data*/}
        {!this.props.user.infoObtained ? (
          <LogoLoader />
        ) : (
          <div>
            <Navigation user={user} match={match} />
            <main className={classes.content}>{this.renderSubRoutes()}</main>
          </div>
        )}
      </div>
    );
  }

  renderSubRoutes() {
    const { match } = this.props;
    return (
      <Switch>
        <Route
          path={`${match.url}${ROUTES.PROGRAMMER}/:value`}
          component={ProgrammerView}
        />
        <Route
          path={`${match.url}${ROUTES.TECHNICAL_AREA_MANAGER}`}
          component={TechnicalAreaManagerView}
        />
        <Route
          path={`${match.url}${ROUTES.REVISION_OFFICE_MANAGER}`}
          component={RevisionOfficeManagerView}
        />
        <Route path={`${match.url}${ROUTES.CLIENT}`} component={ClientView} />
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
