import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CommitsTable } from '../../components/CommitsTable';
import { USER_ROLE_STRINGS, USER_TYPE_IDS } from '../../constants/user';
import { retrieveCommitsListPageAction, startCommitsListUpdatesAutoCheckingAction, stopCommitsListUpdatesAutoCheckingAction } from '../../redux/actions/commits';

const COMMITS_TABLE_HEADER = [
  'ID',
  'Descrizione',
  'Data',
  'Autore',
  'Approvato'
];

const styles = {
  root: {
    flexGrow: 1,
    padding: 16
  }
};

/**
 * @class
 * This class is responsible of displaying the proper
 * components for the programmer view.
 */
class ProgrammerView extends Component {
  constructor(props) {
    super(props);

    this.props.retrieveCommitsListPageAction(
      0,
      USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]
    );
    this.props.startCommitsListUpdatesAutoCheckingAction(
      USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]
    );
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoCheckingAction(
      USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <CommitsTable
              tableToolbarTitle="Lista commit"
              tableHeaderLabels={COMMITS_TABLE_HEADER}
              tableData={this.props.commitsData.listPages}
              itemsCount={this.props.commitsData.totalCommitsCount}
              onPageChange={this.props.retrieveCommitsListPageAction}
              isLoading={this.props.commitsData.isLoadingList}
              userRoleString={USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]}
            />
          </Grid>
        </Grid>
      </Grid>
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
