import Grid from '@material-ui/core/Grid';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { attemptLogout } from '../../actions/auth';
import { getUserInfo } from '../../actions/user';
import { LogoLoader } from '../../components/LogoLoader';
import { HomeAppBar } from '../../components/HomeAppBar';

/**
 * @class
 * This class represents the home page of the webapp.
 * In the home page the main UI will be loaded, so we will load
 * components responsible for loading new data and inserting new data.
 */
class Home extends Component {
  constructor(props) {
    super(props);

    props.getUserInfo(props.accessToken);
  }

  render() {
    return (
      <div>
        {/* We don't want the appBar to be rendered before we get user data*/}
        {!this.props.user.infoObtained ? (
          <LogoLoader />
        ) : (
          <HomeAppBar
            user={this.props.user}
            onLogout={() => this.props.attemptLogout(this.props.accessToken)}
          />
        )}
      </div>
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
  return bindActionCreators({ attemptLogout, getUserInfo }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
