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
import { search } from '../../redux/actions/search';

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
            onSearchRequested={(searchQuery) => this.props.search(searchQuery)}
          />
        )}

        {this.props.match.params.value === '1' && (
          <SendRequestsSubView
            classes={classes}
            startUpdateChecking={this.props.startSendRequestsListUpdatesAutoCheckingAction}
            stopUpdateChecking={this.props.stopSendRequestsListUpdatesAutoCheckingAction}
            sendRequestsData={sendRequestsData}
            onTablePageLoad={(pageNumber, sortingCriteria) => {
              this.props.retrieveSendRequestsListPageAction(
                pageNumber,
                USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
                sortingCriteria
              );
            }}
            onSearchRequested={(searchQuery) => this.props.search(searchQuery)}
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
      retrieveCommitsListPageAction,
      startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoCheckingAction,
      retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoCheckingAction,
      search
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
