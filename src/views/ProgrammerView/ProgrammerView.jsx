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
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { CommitsSubView } from './CommitsSubView';

const COMMITS_TABLE_COLUMNS = [
  { label: 'ID', key: COMMITS_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: COMMITS_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data', key: COMMITS_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Autore', key: COMMITS_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { label: 'Approvato', key: COMMITS_ATTRIBUTE.APPROVAL_STATUS, displayOnMobile: true }
];

const styles = theme => ({
  grid: {
    margin: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      padding: 16
    }
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

    this.renderSubView = this.renderSubView.bind(this);

    this.props.startCommitsListUpdatesAutoCheckingAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
    this.props.startSendRequestsListUpdatesAutoCheckingAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoCheckingAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
    this.props.stopSendRequestsListUpdatesAutoCheckingAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  render() {
    const { classes, commitsData, sendRequestsData } = this.props;
    return (
      <>
        <CommitsSubView
          classes={classes}
          startUpdateChecking={this.props.startCommitsListUpdatesAutoCheckingAction}
          stopUpdateChecking={this.props.stopCommitsListUpdatesAutoCheckingAction}
          commitsData={commitsData}
          onTablePageLoad={(pageNumber, sortingCriteria) => {
            this.props.retrieveCommitsListPageAction(
              pageNumber,
              USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
              sortingCriteria
            );
          }}
        />
        {/*<Grid container className={classes.grid}>
          <Grid item xs={12}>
            <Grid container justify="center">
              {this.renderSubView()}
            </Grid>
          </Grid>
        </Grid>

        <Snackbar open={commitsData.errorWhileCheckingUpdates || sendRequestsData.errorWhileCheckingUpdates}>
          <SnackbarContent
            className={classes.errorSnackbar}
            message="Impossibile controllare gli aggiornamenti per la lista. Controlla la tua connessione."
          />
      </Snackbar>*/}
      </>
    );
  }

  /**
   * Renders the table corresponding to the currently selected tab
   */
  renderSubView() {
    const { match } = this.props;

    switch (match.params.value) {
      case '0':
        return (
          <ProgrammerTable
            key="0"
            tableToolbarTitle="Lista commit"
            tableColumns={COMMITS_TABLE_COLUMNS}
            tableData={this.props.commitsData.listPages}
            itemsCount={this.props.commitsData.totalItemsCount}
            onPageLoad={(pageNumber, sortingCriteria) => {
              this.props.retrieveCommitsListPageAction(
                pageNumber,
                USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
                sortingCriteria
              );
            }}
            isLoading={this.props.commitsData.isLoadingList}
            latestUpdateTimestamp={this.props.commitsData.latestUpdateTimestamp}
            displayError={this.props.commitsData.errorWhileFetchingData}
          />
        );
      case '1':
        return (
          <ProgrammerTable
            key="1"
            tableToolbarTitle="Lista richieste di invio"
            tableColumns={COMMITS_TABLE_COLUMNS}  // to be changed?
            tableData={this.props.sendRequestsData.listPages}
            itemsCount={this.props.sendRequestsData.totalItemsCount}
            onPageLoad={(pageNumber, sortingCriteria) => {
              this.props.retrieveSendRequestsListPageAction(
                pageNumber,
                USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
                sortingCriteria
              );
            }}
            isLoading={this.props.sendRequestsData.isLoadingList}
            latestUpdateTimestamp={this.props.sendRequestsData.latestUpdateTimestamp}
            displayError={this.props.sendRequestsData.errorWhileFetchingData}
          />
        );
      default:
        return null;
    }
  }
}

const mapStateToProps = state => {
  return {
    commitsData: state.programmer.commits,
    sendRequestsData: state.programmer.sendRequests
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveCommitsListPageAction,
      startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoCheckingAction,
      retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoCheckingAction
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
