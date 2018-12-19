import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ProgrammerTable } from '../../components/ProgrammerTable';
import { SEND_REQUESTS_ATTRIBUTE } from '../../constants/sendRequests';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';

const SEND_REQUESTS_TABLE_COLUMNS = [
  { label: 'ID', key: SEND_REQUESTS_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: SEND_REQUESTS_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data', key: SEND_REQUESTS_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Autore', key: SEND_REQUESTS_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { label: 'Approvato', key: SEND_REQUESTS_ATTRIBUTE.APPROVAL_STATUS, displayOnMobile: true }
];

/**
 * @class
 * Renders the content of the send requests tab in ProgrammerView
 */
export class SendRequestsSubView extends Component {
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
                tableToolbarTitle="Lista richieste di invio"
                tableColumns={SEND_REQUESTS_TABLE_COLUMNS}
                tableData={this.props.sendRequestsData.listPages}
                itemsCount={this.props.sendRequestsData.totalItemsCount}
                onPageLoad={this.props.onTablePageLoad}
                isLoading={this.props.sendRequestsData.isLoadingList}
                latestUpdateTimestamp={this.props.sendRequestsData.latestUpdateTimestamp}
                displayError={this.props.sendRequestsData.errorWhileFetchingData}
              />
            </Grid>
          </Grid>
        </Grid>

        <Snackbar open={this.props.sendRequestsData.errorWhileCheckingUpdates}>
          <SnackbarContent
            className={this.props.classes.errorSnackbar}
            message="Impossibile controllare gli aggiornamenti per la lista. Controlla la tua connessione."
          />
        </Snackbar>
      </>
    );
  }
}

SendRequestsSubView.propTypes = {
  classes: PropTypes.object.isRequired,
  startUpdateChecking: PropTypes.func.isRequired,
  stopUpdateChecking: PropTypes.func.isRequired,
  sendRequestsData: PropTypes.object.isRequired,
  onTablePageLoad: PropTypes.func.isRequired,
  onSearchRequested: PropTypes.func.isRequired
};
