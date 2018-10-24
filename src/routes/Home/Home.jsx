import React, { Component } from 'react';
import { HomeAppBar } from '../../components/HomeAppBar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { attemptLogout } from '../../actions/auth';
import { getUserInfo } from '../../actions/user';
import LinearProgress from '@material-ui/core/LinearProgress';

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
        {this.props.user.obtainingInfo ? (
          <LinearProgress variant="indeterminate" style={{ margin: 0 }} />
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
