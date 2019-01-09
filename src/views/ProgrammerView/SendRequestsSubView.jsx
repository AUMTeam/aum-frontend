import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
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
    return (
      <Grid container className={this.props.classes.grid}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <ProgrammerTable
              tableToolbarTitle="Lista richieste di invio"
              tableData={this.props.sendRequestsData.listPages}
              itemsCount={this.props.sendRequestsData.totalItemsCount}
              loadPage={this.props.onTablePageLoad}
              isLoading={this.props.sendRequestsData.isLoadingList}
              onSearchQueryChanged={this.props.onSearchQueryChanged}
              latestUpdateTimestamp={this.props.sendRequestsData.latestUpdateTimestamp}
              displayError={this.props.sendRequestsData.errorWhileFetchingData}
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
