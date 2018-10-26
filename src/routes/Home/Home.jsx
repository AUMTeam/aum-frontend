import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { performLogout } from '../../actions/auth';
import { requestCurrentUserInfo } from '../../actions/user';
import { HomeAppBar } from '../../components/HomeAppBar';
import { LogoLoader } from '../../components/LogoLoader';
import { USER_TYPE_IDS } from '../../reducers/user';

/**
 * @class
 * This class represents the home page of the webapp.
 * In the home page the main UI will be loaded, so we will load
 * components responsible for loading new data and inserting new data.
 */
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionValue: null
    };

    props.requestCurrentUserInfo(props.accessToken);

    this.onSectionChanged = this.onSectionChanged.bind(this);
  }

  static getDerivedStateFromProps(props) {
    return {
      sectionValue: props.user.roles[0]
    };
  }

  render() {
    const { sectionValue } = this.state;
    return (
      <div>
        {/* We don't want the appBar to be rendered before we get user data*/}
        {!this.props.user.infoObtained ? (
          <LogoLoader />
        ) : (
          <div>
            <HomeAppBar
              user={this.props.user}
              onLogout={() => this.props.performLogout(this.props.accessToken)}
              onSectionChanged={this.onSectionChanged}
            />
            {this.renderTabsViews(sectionValue)}
          </div>
        )}
      </div>
    );
  }

  renderTabsViews(selectedTabValue) {
    switch (selectedTabValue) {
      case USER_TYPE_IDS.PROGRAMMER:
        return <h1>Programmatore</h1>;
      case USER_TYPE_IDS.TECHNICAL_AREA_MANAGER:
        return <h1>Referente</h1>;
      case USER_TYPE_IDS.REVISION_OFFICE_MANAGER:
        return <h1>Responsabile uff. revisioni</h1>;
      case USER_TYPE_IDS.CLIENT:
        return <h1>Cliente</h1>;
      default:
        return 'Unknown';
    }
  }

  onSectionChanged(sectionValue) {
    console.log('Changed section with id ' + sectionValue);
    this.setState({ sectionValue });
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ performLogout, requestCurrentUserInfo }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
