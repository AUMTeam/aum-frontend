import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
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
import { performNewSearchAction } from '../../redux/actions/commonList';
import { viewStyles } from '../styles';

class CommitsSubView extends Component {
  componentDidMount() {
    this.props.startCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  render() {
    const { classes, commitsData, retrieveCommitsListPage, performNewSearch } = this.props;

    return (
      <Grid container className={classes.grid}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Paper className={classes.paper}>
              <ProgrammerTable
                tableToolbarTitle="Lista richieste di commit"
                tableData={commitsData.listPages}
                elementType={LIST_ELEMENTS_TYPE.COMMITS}
                itemsCount={commitsData.totalItemsCount}
                loadPage={(pageNumber, sortingCriteria, filter) => {
                  retrieveCommitsListPage(
                    USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
                    pageNumber,
                    sortingCriteria,
                    filter
                  );
                }}
                onSearchQueryChange={searchQuery => {
                  performNewSearch(
                    retrieveCommitsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]),
                    searchQuery
                  );
                }}
                isLoading={commitsData.isLoadingList}
                latestUpdateTimestamp={commitsData.latestUpdateTimestamp}
                displayError={commitsData.errorWhileFetchingData}
                onElementClick={elementId => console.log(`Elemento ${elementId} cliccato!`)}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

CommitsSubView.displayName = 'CommitsSubView';

const mapStateToProps = state => {
  return {
    commitsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].commits
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
