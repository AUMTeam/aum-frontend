import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CommitsTable } from '../../components/CommitsTable';
import { USER_ROLE_STRINGS, USER_TYPE_IDS } from '../../constants/user';
import {
  retrieveCommitsListPageAction,
  retrieveSortedCommitsListPage,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';
import { Snackbar, SnackbarContent } from '@material-ui/core';

const COMMITS_TABLE_COLUMNS = [
  { label: 'ID', key: 'a' },
  { label: 'Descrizione', key: 'b' },
  { label: 'Data', key: 'c' },
  { label: 'Autore', key: 'd' },
  { label: 'Approvato', key: 'e' }
];

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 16
  },
  errorSnackbar: {
    backgroundColor: theme.palette.error.main
  }
});

/**
 * @class
 * This class is responsible of displaying the proper
 * components for the programmer view.
 */
class ProgrammerView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commitsTableSortingCriteria: {
        columnKey: null,
        direction: 'asc'
      }
    };

    this.props.retrieveCommitsListPageAction(0, USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]);
    this.props.startCommitsListUpdatesAutoCheckingAction(USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]);

    this.onCommitsTableSortingRequested = this.onCommitsTableSortingRequested.bind(this);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoCheckingAction(USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]);
  }

  onCommitsTableSortingRequested(currentPage, sortingCriteria) {
    this.props.retrieveSortedCommitsListPage(
      currentPage,
      sortingCriteria,
      USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]
    );
    this.setState({ commitsTableSortingCriteria: sortingCriteria });
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <CommitsTable
                tableToolbarTitle="Lista commit"
                tableColumns={COMMITS_TABLE_COLUMNS}
                tableData={this.props.commitsData.listPages}
                sortBy={this.state.commitsTableSortingCriteria}
                itemsCount={this.props.commitsData.totalCommitsCount}
                onPageChange={pageNumber => {
                  this.props.retrieveCommitsListPageAction(
                    pageNumber,
                    USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]
                  );
                }}
                onSortingRequested={this.onCommitsTableSortingRequested}
                isLoading={this.props.commitsData.isLoadingList}
                displayError={this.props.commitsData.errorWhileFetchingData}
              />
            </Grid>
          </Grid>
        </Grid>

        <Snackbar open={this.props.commitsData.errorWhileCheckingUpdates}>
          <SnackbarContent
            className={classes.errorSnackbar}
            message="Impossibile controllare gli aggiornamenti per la lista. Controlla la tua connessione."
          />
        </Snackbar>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    commitsData: state.programmer.commits
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveCommitsListPageAction,
      retrieveSortedCommitsListPage,
      startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoCheckingAction
    },
    dispatch
  );
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProgrammerView)
);
