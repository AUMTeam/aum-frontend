import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { performLogout } from '../../actions/auth';
import { requestCurrentUserInfo } from '../../actions/user';
import { HomeAppBar } from '../../components/HomeAppBar';
import { LogoLoader } from '../../components/LogoLoader';
import { USER_TYPE_IDS } from '../../reducers/user';
import { ProgrammerView } from '../../views/ProgrammerView';
import { TechnicalAreaManagerView } from '../../views/TechnicalAreaManagerView';
import { RevisionOfficeManagerView } from '../../views/RevisionOfficeManagerView';
import { ClientView } from '../../views/ClientView';

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

  // This is needed to select the first existing tab when user data are retrieved
  static getDerivedStateFromProps(props, state) {
    if (state.sectionValue == null)
      return {
        sectionValue: props.user.roles[0]
      };
    else
      return null;    // don't change state
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
        // This is only a placeholder, we will create specific views for each role.
        return <ProgrammerView />;
      case USER_TYPE_IDS.TECHNICAL_AREA_MANAGER:
        return <TechnicalAreaManagerView />;
      case USER_TYPE_IDS.REVISION_OFFICE_MANAGER:
        return <RevisionOfficeManagerView />;
      case USER_TYPE_IDS.CLIENT:
        return <ClientView />;
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
