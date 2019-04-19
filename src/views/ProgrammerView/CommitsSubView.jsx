import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProgrammerTable from '../../components/ProgrammerTable';
import { LIST_ELEMENTS_TYPE } from '../../constants/api';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import {
  retrieveCommitsListPageAction,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';
import { performNewSearchAction } from '../../redux/actions/lists';
import { viewStyles } from '../styles';

class CommitsSubView extends Component {
  componentDidMount() {
    this.props.startCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  render() {
    const { commitsData, retrieveCommitsListPage, performNewSearch } = this.props;

    return (
      <Grid container className={this.props.classes.grid}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <ProgrammerTable
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
              onElementClick={elementId => console.log(`Elemento ${elementId} cliccato!`)}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

CommitsSubView.displayName = 'CommitsSubView';

const mapStateToProps = state => {
  return {
    commitsData: state[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].commits
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveCommitsListPage: retrieveCommitsListPageAction,
      startCommitsListUpdatesAutoChecking: startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoChecking: stopCommitsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction
    },
    dispatch
  );
};

export default withStyles(viewStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CommitsSubView)
);
