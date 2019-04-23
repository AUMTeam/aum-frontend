import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeliveryTable from '../../components/DeliveryTable/DeliveryTable';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction } from '../../redux/actions/commonList';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { viewStyles } from '../styles';

const EMPTY_ARRAY = [];

class RevisionOfficeManagerView extends React.Component {
  componentDidMount() {
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]);
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]);
  }

  render() {
    const { classes, sendRequestsData, retrieveSendRequestsListPage, performNewSearch } = this.props;

    return (
      <Grid container className={classes.grid}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Paper className={classes.paper}>
              <DeliveryTable
                tableData={sendRequestsData.listPages}
                itemsCount={sendRequestsData.totalItemsCount}
                isLoading={sendRequestsData.isLoadingList}
                latestUpdateTimestamp={sendRequestsData.latestUpdateTimestamp}
                displayError={sendRequestsData.errorWhileFetchingData}
                loadPage={(pageNumber, sortingCriteria, filter) => {
                  retrieveSendRequestsListPage(
                    USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER],
                    pageNumber,
                    sortingCriteria,
                    filter
                  );
                }}
                onSearchQueryChange={searchQuery => {
                  performNewSearch(
                    retrieveSendRequestsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]),
                    searchQuery
                  );
                }}
                onElementDelivery={elementId => console.log(`To be implemented: Invio dell'elemento ${elementId}`)}
                onElementClick={elementId => console.log(`Elemento ${elementId} cliccato!`)}
                successfullyDeliveredElements={EMPTY_ARRAY}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

RevisionOfficeManagerView.displayName = 'RevisionOfficeManagerView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]].sendRequests
    //viewState: state.views[USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]].sendRequests
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction
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
