/* eslint-disable default-case */
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RevisionTable from '../../components/RevisionTable';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { LIST_ELEMENTS_TYPE } from '../../constants/api';
import { NAVIGATION_HIERARCHY } from '../../constants/navigation';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import {
  retrieveCommitsListPageAction,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { performNewSearchAction, reviewItemAction } from '../../redux/actions/lists';
import { viewStyles } from '../styles';

class TechnicalAreaManagerView extends React.Component {
  componentDidMount() {
    this.props.startCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
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
      performNewSearch,
      reviewItem
    } = this.props;

    switch (match.params.value) {
      case NAVIGATION_HIERARCHY[1].tabs[0].value:
        return (
          <RevisionTable
            key={0}
            tableData={commitsData.listPages}
            elementType={LIST_ELEMENTS_TYPE.COMMITS}
            itemsCount={commitsData.totalItemsCount}
            isLoading={commitsData.isLoadingList}
            latestUpdateTimestamp={commitsData.latestUpdateTimestamp}
            displayError={commitsData.errorWhileFetchingData}
            loadPage={(pageNumber, sortingCriteria, filter) => {
              retrieveCommitsListPage(
                USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER],
                pageNumber,
                sortingCriteria,
                filter
              );
            }}
            onSearchQueryChange={searchQuery => {
              performNewSearch(
                retrieveCommitsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]),
                searchQuery
              );
            }}
            onItemReview={(elementId, approvalStatus, callback) =>
              reviewItem(LIST_ELEMENTS_TYPE.COMMITS, elementId, approvalStatus, callback)
            }
            onElementClick={(elementId) => console.log(`Elemento ${elementId} cliccato!`)}
          />
        );
      case NAVIGATION_HIERARCHY[1].tabs[1].value:
        return (
          <RevisionTable
            key={1}
            tableData={sendRequestsData.listPages}
            elementType={LIST_ELEMENTS_TYPE.SEND_REQUESTS}
            itemsCount={sendRequestsData.totalItemsCount}
            isLoading={sendRequestsData.isLoadingList}
            latestUpdateTimestamp={sendRequestsData.latestUpdateTimestamp}
            displayError={sendRequestsData.errorWhileFetchingData}
            loadPage={(pageNumber, sortingCriteria, filter) => {
              retrieveSendRequestsListPage(
                USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER],
                pageNumber,
                sortingCriteria,
                filter
              );
            }}
            onSearchQueryChange={searchQuery => {
              performNewSearch(
                retrieveSendRequestsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]),
                searchQuery
              );
            }}
            onItemReview={(elementId, approvalStatus, callback) =>
              reviewItem(LIST_ELEMENTS_TYPE.SEND_REQUESTS, elementId, approvalStatus, callback)
            }
            onElementClick={(elementId) => console.log(`Elemento ${elementId} cliccato!`)}
          />
        );
    }
  };
}

TechnicalAreaManagerView.displayName = 'TechnicalAreaManagerView';

const mapStateToProps = state => {
  return {
    commitsData: state[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].commits,
    sendRequestsData: state[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].sendRequests
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
      performNewSearch: performNewSearchAction,
      reviewItem: reviewItemAction
    },
    dispatch
  );
};

export default withErrorBoundary(
  withStyles(viewStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(TechnicalAreaManagerView)
  )
);
