import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ElementDetailsDialog from '../../components/ElementDetailsDialog';
import NewSendRequestDialog from '../../components/NewSendRequestDialog';
import ProgrammerTable from '../../components/ProgrammerTable';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { ELEMENT_TYPE } from '../../constants/api';
import { COMMON_ELEMENT_ATTRIBUTE, SEND_REQUEST_ATTRIBUTE, APPROVAL_STATUS } from '../../constants/elements';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction } from '../../redux/actions/commonList';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import {
  addElementAction,
  getShortListForElementAction,
  resetUIStateAction,
  removeElementAction
} from '../../redux/actions/views/programmer';
import { renderElementFieldContentAsText, retrieveElementFromListState } from '../../utils/viewUtils';
import { viewStyles } from '../styles';

const sendRequestDetailsDialogFields = [
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, fullRow: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.DESCRIPTION, fullRow: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.COMPONENTS, fullRow: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.BRANCH },
  { key: SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE },
  { key: SEND_REQUEST_ATTRIBUTE.LINKED_COMMITS },
  { key: SEND_REQUEST_ATTRIBUTE.RECIPIENT_CLIENTS },
  { key: COMMON_ELEMENT_ATTRIBUTE.AUTHOR },
  { key: COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS, label: 'Stato revisione' },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVER, label: 'Revisionato da' }
];

/**
 * @class
 * This is the UI of programmer send requests section.
 */
class SendRequestsCreationView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingSendRequestDetails: false,
      isShowingNewSendRequestDialog: false,
      currentlyShowingSendRequest: {}
    };
  }

  componentDidMount() {
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
    this.props.resetUIState();
  }

  // Close details modal when removal is successful
  static getDerivedStateFromProps(props, state) {
    if (state.isShowingSendRequestDetails && props.removedElementsIds.includes(state.currentlyShowingSendRequest.id))
      return { isShowingSendRequestDetails: false };
    return null;
  }

  render() {
    const {
      classes,
      sendRequestsData,
      retrieveSendRequestsListPage,
      performNewSearch,
      isLoadingClients,
      allClients,
      isLoadingBranches,
      allBranches,
      isLoadingCommits,
      allCommits,
      isAddingElement,
      isAdditionSuccessful,
      isAdditionFailed,
      isRemovingElement,
      removedElementsIds
    } = this.props;
    const { isShowingSendRequestDetails, isShowingNewSendRequestDialog, currentlyShowingSendRequest } = this.state;

    return (
      <>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Paper className={classes.paper}>
                <ProgrammerTable
                  tableToolbarTitle="Lista richieste di invio"
                  tableData={sendRequestsData.listPages}
                  elementType={ELEMENT_TYPE.SEND_REQUESTS}
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
                  onSearchQueryChange={searchQuery => {
                    performNewSearch(
                      retrieveSendRequestsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]),
                      searchQuery
                    );
                  }}
                  latestUpdateTimestamp={sendRequestsData.latestUpdateTimestamp}
                  displayError={sendRequestsData.errorWhileFetchingData}
                  onElementClick={(pageNumber, rowIndex, elementId) => {
                    this.setState({
                      isShowingSendRequestDetails: true,
                      currentlyShowingSendRequest: retrieveElementFromListState(
                        sendRequestsData,
                        elementId,
                        pageNumber,
                        rowIndex
                      )
                    });
                  }}
                  disabledEntries={removedElementsIds}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Fab
          color="secondary"
          variant="extended"
          aria-label="Aggiungi"
          className={classes.fab}
          onClick={this.onFabClick}
        >
          <AddIcon />
          Nuova richiesta di invio
        </Fab>

        <NewSendRequestDialog
          open={isShowingNewSendRequestDialog}
          isLoadingClients={isLoadingClients}
          allClients={allClients.map(client => ({
            value: client.user_id,
            label: client.name
          }))}
          isLoadingBranches={isLoadingBranches}
          allBranches={allBranches.map(branch => ({
            value: branch.id,
            label: branch.name
          }))}
          isLoadingCommits={isLoadingCommits}
          allCommits={allCommits.map(commit => ({
            value: commit.commit_id,
            label: `[${commit.commit_id}] ${commit.title}`
          }))}
          isLoading={isAddingElement}
          isSuccessful={isAdditionSuccessful}
          isFailed={isAdditionFailed}
          onDialogClose={this.onCloseClicked}
          onDialogSend={this.onSendClicked}
        />

        <ElementDetailsDialog
          open={isShowingSendRequestDetails}
          isLoading={isRemovingElement}
          dialogTitle={`Richiesta di invio #${currentlyShowingSendRequest.id}`}
          element={currentlyShowingSendRequest}
          elementFields={sendRequestDetailsDialogFields}
          renderFieldContent={renderElementFieldContentAsText}
          renderExtraActions={this.renderRemoveDialogButtonIfNotReviewed}
          onClose={() => this.setState({ isShowingSendRequestDetails: false })}
        />
      </>
    );
  }

  renderRemoveDialogButtonIfNotReviewed = () => {
    const { currentlyShowingSendRequest } = this.state;
    const { classes, removeElement } = this.props;

    // eslint-disable-next-line eqeqeq
    if (currentlyShowingSendRequest[COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS] == APPROVAL_STATUS.PENDING)
      return (
        <Button
          classes={{ root: classes.errorColor }}
          onClick={() => removeElement(ELEMENT_TYPE.SEND_REQUESTS, currentlyShowingSendRequest.id)}
        >
          Rimuovi
        </Button>
      );
  };

  onCloseClicked = () => {
    this.props.resetUIState();
    this.showAddDialog(false);
  };

  onSendClicked = payload => {
    this.props.addElement(ELEMENT_TYPE.SEND_REQUESTS, payload);
  };

  showAddDialog = show => {
    this.setState({
      isShowingNewSendRequestDialog: show
    });
  };

  onFabClick = () => {
    const { getShortListForElement } = this.props;

    getShortListForElement(ELEMENT_TYPE.CLIENTS);
    getShortListForElement(ELEMENT_TYPE.BRANCHES);
    getShortListForElement(ELEMENT_TYPE.COMMITS);

    this.showAddDialog(true);
  };

  onInputChanged = (name, event) => {
    this.setState({
      [name]: event.target.value
    });
  };
}

SendRequestsCreationView.displayName = 'SendRequestsCreationView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].sendRequests,

    isLoadingClients: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isLoadingClients,
    allClients: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].allClients,
    isLoadingBranches: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isLoadingBranches,
    allBranches: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].allBranches,
    isLoadingCommits: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isLoadingCommits,
    allCommits: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].allCommits,

    isAddingElement: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isAddingElement,
    isAdditionSuccessful: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isAdditionSuccessful,
    isAdditionFailed: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isAdditionFailed,

    isRemovingElement: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isRemovingElement,
    removedElementsIds: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].removedElementsIds
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction,
      getShortListForElement: getShortListForElementAction,
      addElement: addElementAction,
      removeElement: removeElementAction,
      resetUIState: resetUIStateAction
    },
    dispatch
  );
};

export default withErrorBoundary(
  withStyles(viewStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SendRequestsCreationView)
  )
);
