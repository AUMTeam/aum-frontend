import { Snackbar, SnackbarContent } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ProgrammerTable } from '../../components/ProgrammerTable';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { COMMITS_ATTRIBUTE } from '../../constants/commits';
import {
  retrieveCommitsListPageAction,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';

const COMMITS_TABLE_COLUMNS = [
  { label: 'ID', key: COMMITS_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: COMMITS_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data', key: COMMITS_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Autore', key: COMMITS_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { label: 'Approvato', key: COMMITS_ATTRIBUTE.APPROVAL_STATUS, displayOnMobile: true }
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

    this.props.retrieveCommitsListPageAction(0, USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
    this.props.startCommitsListUpdatesAutoCheckingAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);

    this.renderSubView = this.renderSubView.bind(this);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoCheckingAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  render() {
    const { classes, commitsData } = this.props;
    return (
      <>
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <Grid container justify="center">
              {this.renderSubView()}
            </Grid>
          </Grid>
        </Grid>

        <Snackbar open={commitsData.errorWhileCheckingUpdates}>
          <SnackbarContent
            className={classes.errorSnackbar}
            message="Impossibile controllare gli aggiornamenti per la lista. Controlla la tua connessione."
          />
        </Snackbar>
      </>
    );
  }

  renderSubView() {
    const { match } = this.props;

    switch (match.params.value) {
      case '0':
        return (
          <ProgrammerTable
            tableToolbarTitle="Lista commit"
            tableColumns={COMMITS_TABLE_COLUMNS}
            tableData={this.props.commitsData.listPages}
            itemsCount={this.props.commitsData.totalCommitsCount}
            onPageLoad={(pageNumber, sortingCriteria) => {
              this.props.retrieveCommitsListPageAction(
                pageNumber,
                USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
                sortingCriteria
              );
            }}
            isLoading={this.props.commitsData.isLoadingList}
            latestCommitTimestamp={this.props.commitsData.latestCommitTimestamp}
            displayError={this.props.commitsData.errorWhileFetchingData}
          />
        );
      case '1':
        return <h1>Richieste di invio</h1>;
      default:
        return null;
    }
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
