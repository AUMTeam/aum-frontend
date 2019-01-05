import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { performNewSearchAction, reviewItemAction } from '../../redux/actions/lists';
import { viewStyles } from '../styles';
import RevisionTable from '../../components/RevisionTable';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Grid from '@material-ui/core/Grid';
import { LIST_ELEMENTS_TYPE } from '../../constants/api';

class RevisionOfficeManagerView extends React.Component {
  constructor(props) {
    super(props);

    props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]);
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]);
  }

  render() {
    const { classes, sendRequestsData, retrieveSendRequestsListPage, performNewSearch, reviewItem } = this.props;
    return (
      <>
        <Grid container className={classes.grid}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <RevisionTable
                tableData={sendRequestsData.listPages}
                elementType={LIST_ELEMENTS_TYPE.SEND_REQUESTS}
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
                onItemReview={(elementId, approvalStatus, callback) =>
                  reviewItem(LIST_ELEMENTS_TYPE.SEND_REQUESTS, elementId, approvalStatus, callback)
                }
              />
            </Grid>
          </Grid>
        </Grid>

        <Snackbar open={sendRequestsData.errorWhileCheckingUpdates}>
          <SnackbarContent
            className={classes.errorSnackbar}
            message="Impossibile controllare gli aggiornamenti per la lista. Controlla la tua connessione."
          />
        </Snackbar>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    sendRequestsData: state[USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]].sendRequests
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction,
      reviewItem: reviewItemAction
    },
    dispatch
  );
};

export default withStyles(viewStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RevisionOfficeManagerView)
);
