import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RevisionTable from '../../components/RevisionTable';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { LIST_ELEMENTS_TYPE } from '../../constants/api';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction, reviewItemAction } from '../../redux/actions/lists';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { viewStyles } from '../styles';

class RevisionOfficeManagerView extends React.Component {
  componentDidMount() {
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]);
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]);
  }

  render() {
    const { classes, sendRequestsData, retrieveSendRequestsListPage, performNewSearch, reviewItem } = this.props;

    return (
      <Grid container className={classes.grid}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <RevisionTable
              tableData={sendRequestsData.listPages}
              elementType={LIST_ELEMENTS_TYPE.SEND_REQUESTS}
              itemsCount={sendRequestsData.totalItemsCount}
              isLoading={sendRequestsData.isLoadingList}
              latestUpdateTimestamp={sendRequestsData.latestUpdateTimestamp}
              displayError={sendRequestsData.errorWhileFetchingData}
              loadPage={(pageNumber, sortingCriteria, filter) => {
                retrieveSendRequestsListPage(
                  USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER],
                  pageNumber,
                  sortingCriteria,
                  filter
                );
              }}
              onSearchQueryChange={searchQuery => {
                performNewSearch(
                  retrieveSendRequestsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]),
                  searchQuery
                );
              }}
              onItemReview={(elementId, approvalStatus, callback) =>
                reviewItem(LIST_ELEMENTS_TYPE.SEND_REQUESTS, elementId, approvalStatus, callback)
              }
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

RevisionOfficeManagerView.displayName = 'RevisionOfficeManagerView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state[USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]].sendRequests
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
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
    )(RevisionOfficeManagerView)
  )
);
