import { DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProgrammerTable from '../../components/ProgrammerTable';
import ResponsiveDialog from '../../components/ResponsiveDialog';
import { LIST_ELEMENTS_TYPE } from '../../constants/api';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { retrieveCommitsListPageAction, startCommitsListUpdatesAutoCheckingAction, stopCommitsListUpdatesAutoCheckingAction } from '../../redux/actions/commits';
import { performNewSearchAction } from '../../redux/actions/commonList';
import { viewStyles } from '../styles';

class CommitsSubView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingCommit: false
    };
  }

  componentDidMount() {
    this.props.startCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  componentWillUnmount() {
    this.props.stopCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  render() {
    const { classes, commitsData, retrieveCommitsListPage, performNewSearch } = this.props;

    return (
      <>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Paper className={classes.paper}>
                <ProgrammerTable
                  tableToolbarTitle="Lista richieste di commit"
                  tableData={commitsData.listPages}
                  elementType={LIST_ELEMENTS_TYPE.COMMITS}
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
          onClick={() => this.setState({ isAddingCommit: true })}
        >
          <AddIcon />
          Nuova richiesta di commit
        </Fab>
        {/* TODO: implement real commit structure */}
        <ResponsiveDialog open={this.state.isAddingCommit}>
          <DialogTitle>Inserisci una nuova richiesta di commit</DialogTitle>
          <DialogContent>Needs to be implemented</DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => this.setState({ isAddingCommit: false })}>
              Annulla
            </Button>
            <Button color="primary">Invia</Button>
          </DialogActions>
        </ResponsiveDialog>
      </>
    );
  }
}

CommitsSubView.displayName = 'CommitsSubView';

const mapStateToProps = state => {
  return {
    commitsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].commits
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveCommitsListPage: retrieveCommitsListPageAction,
      startCommitsListUpdatesAutoChecking: startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoChecking: stopCommitsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction
    },
    dispatch
  );
};

export default withStyles(viewStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CommitsSubView)
);
