import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ElementDetailsDialog from '../../components/ElementDetailsDialog';
import NewCommitDialog from '../../components/NewCommitDialog/NewCommitDialog';
import ProgrammerTable from '../../components/ProgrammerTable';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { ALL_ELEMENT_TYPE, ELEMENT_TYPE } from '../../constants/api';
import { COMMON_ELEMENT_ATTRIBUTE } from '../../constants/elements';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import {
  retrieveCommitsListPageAction,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';
import { performNewSearchAction } from '../../redux/actions/commonList';
import { addElement, getAll, resetUiState } from '../../redux/actions/views/programmer';
import { renderElementFieldContentAsText, retrieveElementFromListState } from '../../utils/viewUtils';
import { viewStyles } from '../styles';

const commitDetailsDialogFields = [
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, fullRow: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.DESCRIPTION, fullRow: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.BRANCH },
  { key: COMMON_ELEMENT_ATTRIBUTE.COMPONENTS },
  { key: COMMON_ELEMENT_ATTRIBUTE.AUTHOR },
  { key: COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS, label: 'Stato revisione' },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVER, label: 'Revisionato da' }
];

class CommitsCreationView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingCommit: false,
      isShowingCommitDetails: false,
      currentlyShowingCommit: {}
    };
  }

  componentDidMount() {
    this.props.startCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  render() {
    const {
      classes,
      commitsData,
      retrieveCommitsListPage,
      performNewSearch,
      isLoadingBranches,
      allBranches,
      isAddingData,
      isAdditionSuccessful,
      isAdditionFailed
    } = this.props;
    const { isAddingCommit, isShowingCommitDetails, currentlyShowingCommit } = this.state;

    return (
      <>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Paper className={classes.paper}>
                <ProgrammerTable
                  tableToolbarTitle="Lista richieste di commit"
                  tableData={commitsData.listPages}
                  elementType={ELEMENT_TYPE.COMMITS}
                  itemsCount={commitsData.totalItemsCount}
                  loadPage={(pageNumber, sortingCriteria, filter) => {
                    retrieveCommitsListPage(
                      USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER],
                      pageNumber,
                      sortingCriteria,
                      filter
                    );
                  }}
                  onSearchQueryChange={searchQuery => {
                    performNewSearch(
                      retrieveCommitsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]),
                      searchQuery
                    );
                  }}
                  isLoading={commitsData.isLoadingList}
                  latestUpdateTimestamp={commitsData.latestUpdateTimestamp}
                  displayError={commitsData.errorWhileFetchingData}
                  onElementClick={(pageNumber, rowIndex, elementId) => {
                    this.setState({
                      isShowingCommitDetails: true,
                      currentlyShowingCommit: retrieveElementFromListState(
                        commitsData,
                        elementId,
                        pageNumber,
                        rowIndex
                      )
                    });
                  }}
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
          Nuovo commit
        </Fab>

        <NewCommitDialog
          open={isAddingCommit}
          isLoadingBranches={isLoadingBranches}
          allBranches={allBranches.map(branch => ({
            value: branch.id,
            label: branch.name
          }))}
          isLoading={isAddingData}
          isSuccessful={isAdditionSuccessful}
          isFailed={isAdditionFailed}
          onDialogClose={this.onCloseClicked}
          onDialogSend={this.onSendClicked}
        />

        <ElementDetailsDialog
          open={isShowingCommitDetails}
          dialogTitle={`Richiesta di commit #${currentlyShowingCommit.id}`}
          element={currentlyShowingCommit}
          elementFields={commitDetailsDialogFields}
          renderFieldContent={renderElementFieldContentAsText}
          onClose={this.hideDetailsModal}
        />
      </>
    );
  }

  onCloseClicked = () => {
    this.props.resetUiState();
    this.showAddDialog(false);
  };

  onSendClicked = payload => {
    this.props.addElement(ELEMENT_TYPE.COMMITS, payload);
  };

  showAddDialog = show => {
    this.setState({
      isAddingCommit: show
    });
  };

  onFabClick = () => {
    const { getAll } = this.props;

    getAll(ALL_ELEMENT_TYPE.BRANCHES);

    this.showAddDialog(true);
  };

  hideDetailsModal = () => {
    this.setState({ isShowingCommitDetails: false });
  };
}

CommitsCreationView.displayName = 'CommitsCreationView';

const mapStateToProps = state => {
  return {
    commitsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].commits,
    isLoadingBranches: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isLoadingBranches,
    allBranches: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].allBranches,
    isAddingData: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isAddingData,
    isAdditionSuccessful: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isAdditionSuccessful,
    isAdditionFailed: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isAdditionFailed
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveCommitsListPage: retrieveCommitsListPageAction,
      startCommitsListUpdatesAutoChecking: startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoChecking: stopCommitsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction,
      getAll: getAll,
      addElement: addElement,
      resetUiState: resetUiState
    },
    dispatch
  );
};

export default withErrorBoundary(
  withStyles(viewStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(CommitsCreationView)
  )
);
