import React from 'react';
import withErrorBoundary from '../../components/WithErrorBoundary';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ElementDetailsDialog from '../../components/ElementDetailsDialog';
import { COMMON_ELEMENT_ATTRIBUTE, SEND_REQUEST_ATTRIBUTE } from '../../constants/elements';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction } from '../../redux/actions/commonList';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { renderElementFieldContent, retrieveElementFromListState } from '../../utils/viewUtils';
import { viewStyles } from '../styles';
import ClientTable from '../../components/ClientTable';

class ClientView extends React.Component {
  componentDidMount() {
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.CLIENT]);
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.CLIENT]);
  }

  render() {
    const {
      classes,
      sendRequestsData,
      retrieveSendRequestsListPage,
      performNewSearch
    } = this.props;

    return (
      <>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Paper className={classes.paper}>
                <ClientTable
                  tableData={sendRequestsData.listPages}
                  itemsCount={sendRequestsData.totalItemsCount}
                  isLoading={sendRequestsData.isLoadingList}
                  latestUpdateTimestamp={sendRequestsData.latestUpdateTimestamp}
                  displayError={sendRequestsData.errorWhileFetchingData}
                  loadPage={(pageNumber, sortingCriteria, filter) => {
                    retrieveSendRequestsListPage(
                      USER_ROLE_STRING[USER_TYPE_ID.CLIENT],
                      pageNumber,
                      sortingCriteria,
                      filter
                    );
                  }}
                  onSearchQueryChange={searchQuery => {
                    performNewSearch(
                      retrieveSendRequestsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.CLIENT]),
                      searchQuery
                    );
                  }}
                  onElementDownload={this.downloadPatchFileInNewTab}
                  onElementFeedback={() => console.log('Feedback to be implemented')}
                  onElementClick={(pageNumber, rowIndex, elementId) => console.log(`Cliccato elemento ${elementId}`)}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }

  downloadPatchFileInNewTab = (elementId, pageNumber) => {
    const sendRequest = retrieveElementFromListState(this.props.sendRequestsData, elementId, pageNumber);
    const installLink = sendRequest[SEND_REQUEST_ATTRIBUTE.INSTALL_LINK];
    if (installLink != null)
      window.open(installLink, '_blank');
  }
}

ClientView.displayName = 'ClientView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.CLIENT]].sendRequests
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
    )(ClientView)
  )
);
