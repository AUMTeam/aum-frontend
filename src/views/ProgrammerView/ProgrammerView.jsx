/* eslint-disable default-case */
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { NAVIGATION_HIERARCHY } from '../../constants/navigation';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import {
  retrieveCommitsListPageAction,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';
import { performNewSearchAction } from '../../redux/actions/lists';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { viewStyles } from '../styles';
import { CommitsSubView } from './CommitsSubView';
import { SendRequestsSubView } from './SendRequestsSubView';

/**
 * @class
 * This class is responsible for displaying the
 * components of the programmer view according to the selected tab
 */
class ProgrammerView extends Component {
  render() {
    return this.renderSpecificSubView();
  }

  renderSpecificSubView = () => {
    const {
      classes,
      commitsData,
      sendRequestsData,
      retrieveCommitsListPage,
      retrieveSendRequestsListPage,
      performNewSearch
    } = this.props;

    switch (this.props.match.params.value) {
      case NAVIGATION_HIERARCHY[0].tabs[0].value:
        return (
          <CommitsSubView
            classes={classes}
            startUpdateChecking={this.props.startCommitsListUpdatesAutoChecking}
            stopUpdateChecking={this.props.stopCommitsListUpdatesAutoChecking}
            commitsData={commitsData}
            onTablePageLoad={(pageNumber, sortingCriteria, filter) => {
              retrieveCommitsListPage(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER], pageNumber, sortingCriteria, filter);
            }}
            onSearchQueryChanged={searchQuery => {
              performNewSearch(retrieveCommitsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]), searchQuery);
            }}
          />
        );
      case NAVIGATION_HIERARCHY[0].tabs[1].value:
        return (
          <SendRequestsSubView
            classes={classes}
            startUpdateChecking={this.props.startSendRequestsListUpdatesAutoChecking}
            stopUpdateChecking={this.props.stopSendRequestsListUpdatesAutoChecking}
            sendRequestsData={sendRequestsData}
            onTablePageLoad={(pageNumber, sortingCriteria, filter) => {
              retrieveSendRequestsListPage(
                USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
                pageNumber,
                sortingCriteria,
                filter
              );
            }}
            onSearchQueryChanged={searchQuery => {
              performNewSearch(
                retrieveSendRequestsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]),
                searchQuery
              );
            }}
          />
        );
    }
  };
}

const mapStateToProps = state => {
  return {
    commitsData: state.programmer.commits,
    sendRequestsData: state.programmer.sendRequests
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveCommitsListPage: retrieveCommitsListPageAction,
      startCommitsListUpdatesAutoChecking: startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoChecking: stopCommitsListUpdatesAutoCheckingAction,
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction
    },
    dispatch
  );
};

export default withErrorBoundary(
  withStyles(viewStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ProgrammerView)
  )
);
