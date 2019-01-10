import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProgrammerTable from '../../components/ProgrammerTable';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';

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
    const { classes, sendRequestsData, onTablePageLoad, onSearchQueryChanged } = this.props;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <ProgrammerTable
              tableToolbarTitle="Lista richieste di invio"
              tableData={sendRequestsData.listPages}
              itemsCount={sendRequestsData.totalItemsCount}
              loadPage={onTablePageLoad}
              isLoading={sendRequestsData.isLoadingList}
              onSearchQueryChanged={onSearchQueryChanged}
              latestUpdateTimestamp={sendRequestsData.latestUpdateTimestamp}
              displayError={sendRequestsData.errorWhileFetchingData}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

SendRequestsSubView.propTypes = {
  classes: PropTypes.object.isRequired,
  startUpdateChecking: PropTypes.func.isRequired,
  stopUpdateChecking: PropTypes.func.isRequired,
  sendRequestsData: PropTypes.object.isRequired,
  onTablePageLoad: PropTypes.func.isRequired,
  onSearchQueryChanged: PropTypes.func.isRequired
};
