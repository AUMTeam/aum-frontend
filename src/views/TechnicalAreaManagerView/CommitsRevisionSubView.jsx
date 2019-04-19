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
import { performNewSearchAction, reviewItemAction } from '../../redux/actions/lists';
import { viewStyles } from '../styles';

class CommitsRevisionSubView extends React.Component {
  componentDidMount() {
    this.props.startCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
  }

  render() {
    const { commitsData, retrieveCommitsListPage, performNewSearch, reviewItem } = this.props;

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
              onItemReview={(elementId, approvalStatus, callback) =>
                reviewItem(LIST_ELEMENTS_TYPE.COMMITS, elementId, approvalStatus, callback)
              }
              onElementClick={elementId => console.log(`Elemento ${elementId} cliccato!`)}
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
    commitsData: state[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].commits
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
