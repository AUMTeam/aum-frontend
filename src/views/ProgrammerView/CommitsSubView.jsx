import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProgrammerTable from '../../components/ProgrammerTable';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingBottom: 16
  },
  fab: {
    margin: 16,
    bottom: 0,
    right: 0,
    position: 'fixed'
  }
});

/**
 * @class
 * Renders the content of the commits tab in ProgrammerView
 */
class CommitsSubView extends Component {
  componentDidMount() {
    this.props.startUpdateChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopUpdateChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  render() {
    const { classes, commitsData, onTablePageLoad, onSearchQueryChanged } = this.props;

    return (
      <>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <ProgrammerTable
              tableToolbarTitle="Lista commit"
              tableData={commitsData.listPages}
              itemsCount={commitsData.totalItemsCount}
              loadPage={onTablePageLoad}
              onSearchQueryChanged={onSearchQueryChanged}
              isLoading={commitsData.isLoadingList}
              latestUpdateTimestamp={commitsData.latestUpdateTimestamp}
              displayError={commitsData.errorWhileFetchingData}
            />
          </Grid>
        </Grid>
      </Grid>
      <Fab className={classes.fab} color="secondary" variant="extended" aria-label="Add">
        <AddIcon />
        Aggiungi
      </Fab>
      </>
    );
  }
}

CommitsSubView.displayName = 'CommitsSubView';
CommitsSubView.propTypes = {
  classes: PropTypes.object.isRequired,
  startUpdateChecking: PropTypes.func.isRequired,
  stopUpdateChecking: PropTypes.func.isRequired,
  commitsData: PropTypes.object.isRequired,
  onTablePageLoad: PropTypes.func.isRequired,
  onSearchQueryChanged: PropTypes.func.isRequired
};

export default withStyles(styles)(CommitsSubView);