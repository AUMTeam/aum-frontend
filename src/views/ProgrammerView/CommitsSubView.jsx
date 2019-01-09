import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ProgrammerTable from '../../components/ProgrammerTable';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';

/**
 * @class
 * Renders the content of the commits tab in ProgrammerView
 */
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
      <Grid container className={this.props.classes.grid}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <ProgrammerTable
              tableToolbarTitle="Lista commit"
              tableData={this.props.commitsData.listPages}
              itemsCount={this.props.commitsData.totalItemsCount}
              loadPage={this.props.onTablePageLoad}
              onSearchQueryChanged={this.props.onSearchQueryChanged}
              isLoading={this.props.commitsData.isLoadingList}
              latestUpdateTimestamp={this.props.commitsData.latestUpdateTimestamp}
              displayError={this.props.commitsData.errorWhileFetchingData}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

CommitsSubView.propTypes = {
  classes: PropTypes.object.isRequired,
  startUpdateChecking: PropTypes.func.isRequired,
  stopUpdateChecking: PropTypes.func.isRequired,
  commitsData: PropTypes.object.isRequired,
  onTablePageLoad: PropTypes.func.isRequired,
  onSearchQueryChanged: PropTypes.func.isRequired
};
