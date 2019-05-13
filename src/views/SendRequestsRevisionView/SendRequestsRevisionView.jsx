import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ElementDetailsDialog from '../../components/ElementDetailsDialog';
import RevisionTable from '../../components/RevisionTable';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { ELEMENT_TYPE } from '../../constants/api';
import { APPROVAL_STATUS, COMMON_ELEMENT_ATTRIBUTE, SEND_REQUEST_ATTRIBUTE } from '../../constants/elements';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction } from '../../redux/actions/commonList';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { reviewItemAction, TECHNICAL_AREA_MANAGER_ACTION_TYPE } from '../../redux/actions/views/technicalAreaManager';
import { renderElementFieldContentAsText, retrieveElementFromListState } from '../../utils/viewUtils';
import { viewStyles } from '../styles';

const sendRequestDetailsDialogFieldsForReview = [
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, fullRow: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.DESCRIPTION, fullRow: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.COMPONENTS, fullRow: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.BRANCH },
  { key: SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE },
  { key: SEND_REQUEST_ATTRIBUTE.LINKED_COMMITS },
  { key: SEND_REQUEST_ATTRIBUTE.RECIPIENT_CLIENTS },
  { key: COMMON_ELEMENT_ATTRIBUTE.AUTHOR },
  { key: COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP }
];

const sendRequestDetailsDialogFields = [
  ...sendRequestDetailsDialogFieldsForReview,
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS, label: 'Stato revisione' },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVER, label: 'Revisionato da' }
];

class SendRequestsRevisionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // its first value doesn't matter since it's updated when an element is clicked
      // it is used to determine whether to display approve/reject buttons in details dialog
      isReviewingSendRequests: true,

      isShowingSendRequestDetails: false,
      currentlyShowingSendRequest: {}
    };
  }

  componentDidMount() {
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
    this.props.resetUI();
  }

  // Close details modal when review is successful
  static getDerivedStateFromProps(props, state) {
    if (state.isReviewingSendRequests && state.currentlyShowingSendRequest.id in props.successfullyReviewedItems)
      return { isShowingSendRequestDetails: false };
    return null;
  }

  render() {
    const {
      classes,
      sendRequestsData,
      retrieveSendRequestsListPage,
      performNewSearch,
      reviewItem,
      reviewInProgressItems,
      successfullyReviewedItems,
      failedReviewItems
    } = this.props;
    const { isReviewingSendRequests, isShowingSendRequestDetails, currentlyShowingSendRequest } = this.state;

    return (
      <>
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
                  onElementClick={(pageNumber, rowIndex, elementId, isReviewing) => {
                    this.setState({
                      isReviewingSendRequests: isReviewing,
                      isShowingSendRequestDetails: true,
                      currentlyShowingSendRequest: retrieveElementFromListState(
                        sendRequestsData,
                        elementId,
                        pageNumber,
                        rowIndex
                      )
                    });
                  }}
                  reviewInProgressItems={reviewInProgressItems}
                  successfullyReviewedItems={successfullyReviewedItems}
                  failedReviewItems={failedReviewItems}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <ElementDetailsDialog
          open={isShowingSendRequestDetails}
          isLoading={reviewInProgressItems.includes(currentlyShowingSendRequest.id)}
          dialogTitle={`Richiesta di invio #${currentlyShowingSendRequest.id}`}
          element={currentlyShowingSendRequest}
          elementFields={
            isReviewingSendRequests ? sendRequestDetailsDialogFieldsForReview : sendRequestDetailsDialogFields
          }
          renderFieldContent={renderElementFieldContentAsText}
          onClose={this.hideDetailsModal}
          backButtonToTheLeft={isReviewingSendRequests}
          renderExtraActions={isReviewingSendRequests ? this.renderApproveRejectModalActions : undefined}
        />
      </>
    );
  }

  renderApproveRejectModalActions = () => {
    const { classes, reviewItem } = this.props;
    const { currentlyShowingSendRequest } = this.state;

    return (
      <>
        <Button
          classes={{ root: classes.errorColor }}
          onClick={() =>
            reviewItem(ELEMENT_TYPE.SEND_REQUESTS, currentlyShowingSendRequest.id, APPROVAL_STATUS.REJECTED)
          }
        >
          Rifiuta
        </Button>
        <Button
          classes={{ root: classes.approvedColor }}
          onClick={() =>
            reviewItem(ELEMENT_TYPE.SEND_REQUESTS, currentlyShowingSendRequest.id, APPROVAL_STATUS.APPROVED)
          }
        >
          Approva
        </Button>
      </>
    );
  };

  hideDetailsModal = () => {
    this.setState({ isShowingSendRequestDetails: false });
  };
}

SendRequestsRevisionView.displayName = 'SendRequestsRevisionView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].sendRequests,
    reviewInProgressItems:
      state.views[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].sendRequests.reviewInProgress,
    successfullyReviewedItems:
      state.views[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].sendRequests.successfullyReviewed,
    failedReviewItems: state.views[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].sendRequests.reviewFailed
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

export default withErrorBoundary(
  withStyles(viewStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SendRequestsRevisionView)
  )
);
