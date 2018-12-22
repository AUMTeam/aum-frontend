import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
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
import { SendRequestsSubView } from './SendRequestsSubView';

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
 * This class is responsible for displaying the
 * components of the programmer view according to the selected tab
 */
class ProgrammerView extends Component {
  render() {
    const { classes, commitsData, sendRequestsData } = this.props;
    return (
      <>
        {this.props.match.params.value === '0' && (
          <CommitsSubView
            classes={classes}
            startUpdateChecking={this.props.startCommitsListUpdatesAutoChecking}
            stopUpdateChecking={this.props.stopCommitsListUpdatesAutoChecking}
            commitsData={commitsData}
            onTablePageLoad={(pageNumber, sortingCriteria) => {
              this.props.retrieveCommitsListPage(
                pageNumber,
                USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
                sortingCriteria
              );
            }}
          />
        )}

        {this.props.match.params.value === '1' && (
          <SendRequestsSubView
            classes={classes}
            startUpdateChecking={this.props.startSendRequestsListUpdatesAutoChecking}
            stopUpdateChecking={this.props.stopSendRequestsListUpdatesAutoChecking}
            sendRequestsData={sendRequestsData}
            onTablePageLoad={(pageNumber, sortingCriteria) => {
              this.props.retrieveSendRequestsListPage(
                pageNumber,
                USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
                sortingCriteria
              );
            }}
          />
        )}
      </>
    );
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
      retrieveCommitsListPage: retrieveCommitsListPageAction,
      startCommitsListUpdatesAutoChecking: startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoChecking: stopCommitsListUpdatesAutoCheckingAction,
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction
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
