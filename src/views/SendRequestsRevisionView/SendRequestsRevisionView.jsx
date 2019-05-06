import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RevisionTable from '../../components/RevisionTable';
import { ELEMENT_TYPE } from '../../constants/api';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction } from '../../redux/actions/commonList';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { reviewItemAction, TECHNICAL_AREA_MANAGER_ACTION_TYPE } from '../../redux/actions/views/technicalAreaManager';
import { viewStyles } from '../styles';

class SendRequestsRevisionView extends React.Component {
  componentDidMount() {
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
    this.props.resetUI();
  }

  render() {
    const {
      classes,
      sendRequestsData,
      retrieveSendRequestsListPage,
      performNewSearch,
      reviewItem,
      viewState
    } = this.props;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Paper className={classes.paper}>
              <RevisionTable
                tableData={sendRequestsData.listPages}
                elementType={ELEMENT_TYPE.SEND_REQUESTS}
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
                onItemReview={(elementId, approvalStatus) =>
                  reviewItem(ELEMENT_TYPE.SEND_REQUESTS, elementId, approvalStatus)
                }
                onElementClick={elementId => console.log(`Elemento ${elementId} cliccato!`)}
                reviewInProgressItems={viewState.reviewInProgress}
                successfullyReviewedItems={viewState.successfullyReviewed}
                failedReviewItems={viewState.reviewFailed}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

SendRequestsRevisionView.displayName = 'SendRequestsRevisionView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].sendRequests,
    viewState: state.views[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].sendRequests
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction,
      reviewItem: reviewItemAction,
      resetUI: () => ({ type: TECHNICAL_AREA_MANAGER_ACTION_TYPE.RESET_UI })
    },
    dispatch
  );
};

export default withStyles(viewStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SendRequestsRevisionView)
);
