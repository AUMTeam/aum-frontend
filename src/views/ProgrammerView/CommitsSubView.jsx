import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ProgrammerTable } from '../../components/ProgrammerTable';
import { COMMITS_ATTRIBUTE } from '../../constants/commits';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';

const COMMITS_TABLE_COLUMNS = [
  { label: 'ID', key: COMMITS_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: COMMITS_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data', key: COMMITS_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Autore', key: COMMITS_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { label: 'Approvato', key: COMMITS_ATTRIBUTE.APPROVAL_STATUS, displayOnMobile: true }
];

export class CommitsSubView extends Component {
  constructor(props) {
    super(props);

    this.props.startUpdateChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopUpdateChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  render() {
    return (
      <>
        <Grid container className={this.props.classes.grid}>
          <Grid item xs={12}>
            <Grid container justify="center">
            <ProgrammerTable
                key="0"
                tableToolbarTitle="Lista commit"
                tableColumns={COMMITS_TABLE_COLUMNS}
                tableData={this.props.commitsData.listPages}
                itemsCount={this.props.commitsData.totalItemsCount}
                onPageLoad={this.props.onTablePageLoad}
                isLoading={this.props.commitsData.isLoadingList}
                latestUpdateTimestamp={this.props.commitsData.latestUpdateTimestamp}
                displayError={this.props.commitsData.errorWhileFetchingData}
            />
            </Grid>
          </Grid>
        </Grid>

        <Snackbar open={this.props.commitsData.errorWhileCheckingUpdates}>
          <SnackbarContent
            className={this.props.classes.errorSnackbar}
            message="Impossibile controllare gli aggiornamenti per la lista. Controlla la tua connessione."
          />
        </Snackbar>
      </>)
      ;
  }
}

CommitsSubView.propTypes = {
  classes: PropTypes.object.isRequired,
  startUpdateChecking: PropTypes.func.isRequired,
  stopUpdateChecking: PropTypes.func.isRequired,
  commitsData: PropTypes.object.isRequired,
  onTablePageLoad: PropTypes.func.isRequired
}