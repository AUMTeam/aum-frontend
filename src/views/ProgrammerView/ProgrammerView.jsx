import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CommitsTable } from '../../components/CommitsTable';
import { USER_ROLE_STRINGS, USER_TYPE_IDS } from '../../constants/user';
import {
  retrieveCommitsListPageAction,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';
import { Snackbar, SnackbarContent } from '@material-ui/core';

const COMMITS_TABLE_COLUMNS = [
  { label: 'ID', key: '' },
  { label: 'Descrizione', key: '' },
  { label: 'Data', key: '' },
  { label: 'Autore', key: '' },
  { label: 'Approvato', key: '' }
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

    this.props.retrieveCommitsListPageAction(0, USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]);
    this.props.startCommitsListUpdatesAutoCheckingAction(USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoCheckingAction(USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]);
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
                sortBy={{ key: null, direction: null }}
                itemsCount={this.props.commitsData.totalCommitsCount}
                onPageChange={this.props.retrieveCommitsListPageAction}
                onSortingRequested={this.props.retrieveCommitsListPageAction}
                isLoading={this.props.commitsData.isLoadingList}
                userRoleString={USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]}
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
