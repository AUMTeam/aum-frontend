import { Snackbar, SnackbarContent } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CommitsTable } from '../../components/CommitsTable';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import {
  retrieveCommitsListPageAction,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';

const COMMITS_TABLE_HEADER = ['ID', 'Descrizione', 'Data', 'Autore', 'Approvato'];

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
      case "0":
        return (
          <CommitsTable
            tableToolbarTitle="Lista commit"
            tableHeaderLabels={COMMITS_TABLE_HEADER}
            tableData={this.props.commitsData.listPages}
            itemsCount={this.props.commitsData.totalCommitsCount}
            onPageChange={this.props.retrieveCommitsListPageAction}
            isLoading={this.props.commitsData.isLoadingList}
            latestCommitTimestamp={this.props.commitsData.latestCommitTimestamp}
            userRoleString={USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]}
            displayError={this.props.commitsData.errorWhileFetchingData}
          />
        );
      case "1":
        return <h1>Richieste di invio</h1>;
    }

    return null;
  }
}

ProgrammerView.propTypes = {
  classes: PropTypes.object.isRequired
};

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
