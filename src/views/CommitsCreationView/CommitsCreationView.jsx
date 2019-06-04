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
import NewCommitDialog from '../../components/NewCommitDialog/NewCommitDialog';
import ProgrammerTable from '../../components/ProgrammerTable';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { ELEMENT_TYPE } from '../../constants/api';
import { COMMON_ELEMENT_ATTRIBUTE } from '../../constants/elements';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import {
  retrieveCommitsListPageAction,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';
import { performNewSearchAction } from '../../redux/actions/commonList';
import {
  addElementAction,
  getShortListForElementAction,
  resetUIStateAction,
  removeElementAction
} from '../../redux/actions/views/programmer';
import { renderElementFieldContentAsText, retrieveElementFromListState, canElementBeRemoved } from '../../utils/viewUtils';
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

/**
 * @class
 * This is the UI of programmer commits section.
 */
class CommitsCreationView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingCommitDetails: false,
      isShowingNewCommitDialog: false,
      currentlyShowingCommit: {}
    };
  }

  componentDidMount() {
    this.props.startCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
    this.props.resetUIState();
  }

  // Close details modal when removal is successful
  static getDerivedStateFromProps(props, state) {
    if (state.isShowingCommitDetails && props.removedElementsIds.includes(state.currentlyShowingCommit.id))
      return { isShowingCommitDetails: false };
    return null;
  }

  render() {
    const {
      classes,
      commitsData,
      retrieveCommitsListPage,
      performNewSearch,
      isLoadingBranches,
      allBranches,
      isAddingElement,
      isAdditionSuccessful,
      isAdditionFailed,
      isRemovingElement,
      removedElementsIds
    } = this.props;
    const { isShowingCommitDetails, isShowingNewCommitDialog, currentlyShowingCommit } = this.state;

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
                      currentlyShowingCommit: retrieveElementFromListState(commitsData, elementId, pageNumber, rowIndex)
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
          Nuovo commit
        </Fab>

        <NewCommitDialog
          open={isShowingNewCommitDialog}
          isLoadingBranches={isLoadingBranches}
          allBranches={allBranches.map(branch => ({
            value: branch.id,
            label: branch.name
          }))}
          isLoading={isAddingElement}
          isSuccessful={isAdditionSuccessful}
          isFailed={isAdditionFailed}
          onDialogClose={this.onCloseClicked}
          onDialogSend={this.onSendClicked}
        />

        <ElementDetailsDialog
          open={isShowingCommitDetails}
          isLoading={isRemovingElement}
          dialogTitle={`Richiesta di commit #${currentlyShowingCommit.id}`}
          element={currentlyShowingCommit}
          elementFields={commitDetailsDialogFields}
          renderFieldContent={renderElementFieldContentAsText}
          renderExtraActions={this.renderRemoveDialogButtonIfNeeded}
          onClose={() => this.setState({ isShowingCommitDetails: false })}
        />
      </>
    );
  }

  renderRemoveDialogButtonIfNeeded = () => {
    const { currentlyShowingCommit } = this.state;
    const { classes, removeElement, currentUser } = this.props;

    if (canElementBeRemoved(currentlyShowingCommit, currentUser))
      return (
        <Button
          classes={{ root: classes.errorColor }}
          onClick={() => removeElement(ELEMENT_TYPE.COMMITS, currentlyShowingCommit.id)}
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
    this.props.addElement(ELEMENT_TYPE.COMMITS, payload);
  };

  showAddDialog = show => {
    this.setState({
      isShowingNewCommitDialog: show
    });
  };

  onFabClick = () => {
    this.props.getShortListForElement(ELEMENT_TYPE.BRANCHES);
    this.showAddDialog(true);
  };
}

CommitsCreationView.displayName = 'CommitsCreationView';

const mapStateToProps = state => {
  return {
    currentUser: state.user,

    commitsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].commits,
    isLoadingBranches: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].isLoadingBranches,
    allBranches: state.views[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].allBranches,

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
      retrieveCommitsListPage: retrieveCommitsListPageAction,
      startCommitsListUpdatesAutoChecking: startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoChecking: stopCommitsListUpdatesAutoCheckingAction,
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
    )(CommitsCreationView)
  )
);
