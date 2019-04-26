import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NewSendRequestDialog from '../../components/NewSendRequestDialog';
import ProgrammerTable from '../../components/ProgrammerTable';
import { ALL_ELEMENT_TYPE, ELEMENT_TYPE } from '../../constants/api';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction } from '../../redux/actions/commonList';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { addElement, getAll, resetUiState } from '../../redux/actions/views/programmer';
import { viewStyles } from '../styles';

class SendRequestsSubView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingSendRequest: false
    };
  }

  componentDidMount() {
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
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
      isAddingData,
      isAdditionSuccessful,
      isAdditionFailed
    } = this.props;
    const { isAddingSendRequest } = this.state;

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
                  onElementClick={elementId => console.log(`Elemento ${elementId} cliccato!`)}
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
          onClick={() => this.onFabClick()}
        >
          <AddIcon />
          Nuova richiesta di invio
        </Fab>
        <NewSendRequestDialog
          open={isAddingSendRequest}
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
            value: commit,
            label: commit
          }))}
          isLoading={isAddingData}
          isSuccessful={isAdditionSuccessful}
          isFailed={isAdditionFailed}
          onDialogClose={() => this.onCloseClicked()}
          onDialogSend={this.onSendClicked}
        />
      </>
    );
  }

  onCloseClicked = () => {
    this.props.resetUiState();
    this.showDialog(false);
  };

  onSendClicked = payload => {
    this.props.addElement(ELEMENT_TYPE.SEND_REQUESTS, payload);
  };

  showDialog = show => {
    this.setState({
      isAddingSendRequest: show
    });
  };

  onFabClick = () => {
    const { getAll } = this.props;

    getAll(ALL_ELEMENT_TYPE.CLIENTS);
    getAll(ALL_ELEMENT_TYPE.BRANCHES);
    getAll(ALL_ELEMENT_TYPE.COMMITS);

    this.showDialog(true);
  };

  onInputChanged = (name, event) => {
    this.setState({
      [name]: event.target.value
    });
  };
}

SendRequestsSubView.displayName = 'SendRequestsSubView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].sendRequests,
    isLoadingClients: state.views.programmerView.isLoadingClients,
    allClients: state.views.programmerView.allClients,
    isLoadingBranches: state.views.programmerView.isLoadingBranches,
    allBranches: state.views.programmerView.allBranches,
    isLoadingCommits: state.views.programmerView.isLoadingCommits,
    allCommits: state.views.programmerView.allCommits,
    isAddingData: state.views.programmerView.isAddingData,
    isAdditionSuccessful: state.views.programmerView.isAdditionSuccessful,
    isAdditionFailed: state.views.programmerView.isAdditionFailed
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction,
      getAll: getAll,
      addElement: addElement,
      resetUiState: resetUiState
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
