import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { viewStyles } from '../styles';

class RevisionOfficeManagerView extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <p>To be done</p>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

RevisionOfficeManagerView.displayName = 'RevisionOfficeManagerView';

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction,
    },
    dispatch
  );
};

export default withErrorBoundary(
  withStyles(viewStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(RevisionOfficeManagerView)
  )
);
