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
import { APPROVAL_STATUS, COMMON_ELEMENT_ATTRIBUTE } from '../../constants/elements';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import {
  retrieveCommitsListPageAction,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';
import { performNewSearchAction } from '../../redux/actions/commonList';
import { reviewItemAction, TECHNICAL_AREA_MANAGER_ACTION_TYPE } from '../../redux/actions/views/technicalAreaManager';
import { renderElementFieldContentAsText, retrieveElementFromListState } from '../../utils/viewUtils';
import { viewStyles } from '../styles';

const commitDetailsDialogFieldsForReview = [
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, fullRow: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.DESCRIPTION, fullRow: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.BRANCH },
  { key: COMMON_ELEMENT_ATTRIBUTE.COMPONENTS },
  { key: COMMON_ELEMENT_ATTRIBUTE.AUTHOR },
  { key: COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP }
];

const commitDetailsDialogFields = [
  ...commitDetailsDialogFieldsForReview,
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS, label: 'Stato revisione' },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVER, label: 'Revisionato da' }
];

class CommitsRevisionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // its first value doesn't matter since it's updated when an element is clicked
      // it is used to determine whether to display approve/reject buttons in details dialog
      isReviewingCommits: true,

      isShowingCommitDetails: false,
      currentlyShowingCommit: {}
    };
  }

  componentDidMount() {
    this.props.startCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
    this.props.resetUI();
  }

  // Close details modal when review is successful
  static getDerivedStateFromProps(props, state) {
    if (state.isReviewingCommits && state.currentlyShowingCommit.id in props.successfullyReviewedItems)
      return { isShowingCommitDetails: false };
    return null;
  }

  render() {
    const {
      classes,
      commitsData,
      retrieveCommitsListPage,
      performNewSearch,
      reviewItem,
      reviewInProgressItems,
      successfullyReviewedItems,
      failedReviewItems
    } = this.props;
    const { isShowingCommitDetails, isReviewingCommits, currentlyShowingCommit } = this.state;

    return (
      <>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Paper className={classes.paper}>
                <RevisionTable
                  tableData={commitsData.listPages}
                  elementType={ELEMENT_TYPE.COMMITS}
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
                  onItemReview={(elementId, approvalStatus) =>
                    reviewItem(ELEMENT_TYPE.COMMITS, elementId, approvalStatus)
                  }
                  onElementClick={(pageNumber, rowIndex, elementId, isReviewing) => {
                    this.setState({
                      isReviewingCommits: isReviewing,
                      isShowingCommitDetails: true,
                      currentlyShowingCommit: retrieveElementFromListState(commitsData, elementId, pageNumber, rowIndex)
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
          open={isShowingCommitDetails}
          isLoading={reviewInProgressItems.includes(currentlyShowingCommit.id)}
          dialogTitle={`Richiesta di commit #${currentlyShowingCommit.id}`}
          element={currentlyShowingCommit}
          elementFields={isReviewingCommits ? commitDetailsDialogFieldsForReview : commitDetailsDialogFields}
          renderFieldContent={renderElementFieldContentAsText}
          onClose={this.hideDetailsModal}
          backButtonToTheLeft={isReviewingCommits}
          renderExtraActions={isReviewingCommits ? this.renderApproveRejectModalActions : undefined}
        />
      </>
    );
  }

  renderApproveRejectModalActions = () => {
    const { classes, reviewItem } = this.props;
    const { currentlyShowingCommit } = this.state;

    return (
      <>
        <Button
          classes={{ root: classes.errorColor }}
          onClick={() => reviewItem(ELEMENT_TYPE.COMMITS, currentlyShowingCommit.id, APPROVAL_STATUS.REJECTED)}
        >
          Rifiuta
        </Button>
        <Button
          classes={{ root: classes.approvedColor }}
          onClick={() => reviewItem(ELEMENT_TYPE.COMMITS, currentlyShowingCommit.id, APPROVAL_STATUS.APPROVED)}
        >
          Approva
        </Button>
      </>
    );
  };

  hideDetailsModal = () => {
    this.setState({ isShowingCommitDetails: false });
  };
}

CommitsRevisionView.displayName = 'CommitsRevisionView';

const mapStateToProps = state => {
  return {
    commitsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].commits,
    reviewInProgressItems: state.views[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].commits.reviewInProgress,
    successfullyReviewedItems:
      state.views[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].commits.successfullyReviewed,
    failedReviewItems: state.views[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].commits.reviewFailed
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveCommitsListPage: retrieveCommitsListPageAction,
      startCommitsListUpdatesAutoChecking: startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoChecking: stopCommitsListUpdatesAutoCheckingAction,
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
    )(CommitsRevisionView)
  )
);
