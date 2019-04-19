/* eslint-disable default-case */
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { NAVIGATION_HIERARCHY } from '../../constants/navigation';
import { LIST_ELEMENTS_TYPE } from '../../constants/api';
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
import ProgrammerTable from '../../components/ProgrammerTable';

/**
 * @class
 * This class is responsible for displaying the
 * components of the programmer view according to the selected tab
 */
class ProgrammerView extends Component {
  componentDidMount() {
    this.props.startCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  render() {
    return (
      <Grid container className={this.props.classes.grid}>
        <Grid item xs={12}>
          <Grid container justify="center">
            {this.renderSpecificTable()}
          </Grid>
        </Grid>
      </Grid>
    );
  }

  renderSpecificTable = () => {
    const {
      match,
      commitsData,
      sendRequestsData,
      retrieveCommitsListPage,
      retrieveSendRequestsListPage,
      performNewSearch
    } = this.props;

    switch (match.params.value) {
      case NAVIGATION_HIERARCHY[0].tabs[0].value:
        return (
          <ProgrammerTable
            key={0}
            tableToolbarTitle="Lista richieste di commit"
            tableData={commitsData.listPages}
            elementType={LIST_ELEMENTS_TYPE.COMMITS}
            itemsCount={commitsData.totalItemsCount}
            loadPage={(pageNumber, sortingCriteria, filter) => {
              retrieveCommitsListPage(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER], pageNumber, sortingCriteria, filter);
            }}
            onSearchQueryChanged={searchQuery => {
              performNewSearch(retrieveCommitsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]), searchQuery);
            }}
            isLoading={commitsData.isLoadingList}
            latestUpdateTimestamp={commitsData.latestUpdateTimestamp}
            displayError={commitsData.errorWhileFetchingData}
            onElementClick={(elementId) => console.log(`Elemento ${elementId} cliccato!`)}
          />
        );
      case NAVIGATION_HIERARCHY[0].tabs[1].value:
        return (
          <ProgrammerTable
            key={1}
            tableToolbarTitle="Lista richieste di invio"
            tableData={sendRequestsData.listPages}
            elementType={LIST_ELEMENTS_TYPE.SEND_REQUESTS}
            itemsCount={sendRequestsData.totalItemsCount}
            loadPage={(pageNumber, sortingCriteria, filter) => {
              retrieveSendRequestsListPage(
                USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
                pageNumber,
                sortingCriteria,
                filter
              );
            }}
            isLoading={sendRequestsData.isLoadingList}
            onSearchQueryChanged={searchQuery => {
              performNewSearch(
                retrieveSendRequestsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]),
                searchQuery
              );
            }}
            latestUpdateTimestamp={sendRequestsData.latestUpdateTimestamp}
            displayError={sendRequestsData.errorWhileFetchingData}
            onElementClick={(elementId) => console.log(`Elemento ${elementId} cliccato!`)}
          />
        );
    }
  };
}

ProgrammerView.displayName = 'ProgrammerView';

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
