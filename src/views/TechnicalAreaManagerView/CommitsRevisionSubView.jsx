import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RevisionTable from '../../components/RevisionTable';
import { LIST_ELEMENTS_TYPE } from '../../constants/api';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import {
  retrieveCommitsListPageAction,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';
import { performNewSearchAction } from '../../redux/actions/commonList';
import { reviewItemAction } from '../../redux/actions/views/technicalAreaManager';
import { viewStyles } from '../styles';

class CommitsRevisionSubView extends React.Component {
  componentDidMount() {
    this.props.startCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
  }

  render() {
    const { commitsData, retrieveCommitsListPage, performNewSearch, reviewItem, viewState } = this.props;

    return (
      <Grid container className={this.props.classes.grid}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <RevisionTable
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
              onItemReview={(elementId, approvalStatus) =>
                reviewItem(LIST_ELEMENTS_TYPE.COMMITS, elementId, approvalStatus)
              }
              onElementClick={elementId => console.log(`Elemento ${elementId} cliccato!`)}
              reviewInProgressItems={viewState.reviewInProgress}
              successfullyReviewedItems={viewState.successfullyReviewed}
              failedReviewItems={viewState.reviewFailed}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

CommitsRevisionSubView.displayName = 'CommitsRevisionSubView';

const mapStateToProps = state => {
  return {
    commitsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].commits,
    viewState: state.views[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].commits
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveCommitsListPage: retrieveCommitsListPageAction,
      startCommitsListUpdatesAutoChecking: startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoChecking: stopCommitsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction,
      reviewItem: reviewItemAction
    },
    dispatch
  );
};

export default withStyles(viewStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CommitsRevisionSubView)
);
