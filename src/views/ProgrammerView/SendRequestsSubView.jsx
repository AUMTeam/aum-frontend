import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProgrammerTable from '../../components/ProgrammerTable';
import { LIST_ELEMENTS_TYPE } from '../../constants/api';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction } from '../../redux/actions/lists';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { viewStyles } from '../styles';

class SendRequestsSubView extends Component {
  componentDidMount() {
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  render() {
    const { sendRequestsData, retrieveSendRequestsListPage, performNewSearch } = this.props;

    return (
      <Grid container className={this.props.classes.grid}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <ProgrammerTable
              tableToolbarTitle="Lista richieste di invio"
              tableData={sendRequestsData.listPages}
              elementType={LIST_ELEMENTS_TYPE.SEND_REQUESTS}
              itemsCount={sendRequestsData.totalItemsCount}
              loadPage={(pageNumber, sortingCriteria, filter) => {
                retrieveSendRequestsListPage(
                  USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
                  pageNumber,
                  sortingCriteria,
                  filter
                );
              }}
              isLoading={sendRequestsData.isLoadingList}
              onSearchQueryChanged={searchQuery => {
                performNewSearch(
                  retrieveSendRequestsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]),
                  searchQuery
                );
              }}
              latestUpdateTimestamp={sendRequestsData.latestUpdateTimestamp}
              displayError={sendRequestsData.errorWhileFetchingData}
              onElementClick={elementId => console.log(`Elemento ${elementId} cliccato!`)}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

SendRequestsSubView.displayName = 'SendRequestsSubView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].sendRequests
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

export default withStyles(viewStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SendRequestsSubView)
);
