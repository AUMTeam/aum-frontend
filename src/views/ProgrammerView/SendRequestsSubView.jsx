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
import { LIST_ELEMENTS_TYPE, ALL_ELEMENT_TYPE } from '../../constants/api';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction } from '../../redux/actions/commonList';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { viewStyles } from '../styles';
import { getAll } from '../../redux/actions/views/programmer';

const suggestions = [
  { label: 'Afghanistan' },
  { label: 'Aland Islands' },
  { label: 'Albania' },
  { label: 'Algeria' },
  { label: 'American Samoa' },
  { label: 'Andorra' },
  { label: 'Angola' },
  { label: 'Anguilla' },
  { label: 'Antarctica' },
  { label: 'Antigua and Barbuda' },
  { label: 'Argentina' },
  { label: 'Armenia' },
  { label: 'Aruba' },
  { label: 'Australia' },
  { label: 'Austria' },
  { label: 'Azerbaijan' },
  { label: 'Bahamas' },
  { label: 'Bahrain' },
  { label: 'Bangladesh' },
  { label: 'Barbados' },
  { label: 'Belarus' },
  { label: 'Belgium' },
  { label: 'Belize' },
  { label: 'Benin' },
  { label: 'Bermuda' },
  { label: 'Bhutan' },
  { label: 'Bolivia, Plurinational State of' },
  { label: 'Bonaire, Sint Eustatius and Saba' },
  { label: 'Bosnia and Herzegovina' },
  { label: 'Botswana' },
  { label: 'Bouvet Island' },
  { label: 'Brazil' },
  { label: 'British Indian Ocean Territory' },
  { label: 'Brunei Darussalam' }
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label,
}));

class SendRequestsSubView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingSendRequest: false
    };
  }

  componentDidMount() {
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
    this.props.getAll(ALL_ELEMENT_TYPE.CLIENTS)
    this.props.getAll(ALL_ELEMENT_TYPE.BRANCHES)
    this.props.getAll(ALL_ELEMENT_TYPE.COMMITS)
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]);
  }

  render() {
    const { classes, sendRequestsData, retrieveSendRequestsListPage, performNewSearch, allClients, allBranches, allCommits } = this.props;
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
          onClick={() => this.setState({ isAddingSendRequest: true })}
        >
          <AddIcon />
          Nuova richiesta di invio
        </Fab>
        <NewSendRequestDialog
          open={isAddingSendRequest}
          allClients={allClients}
          allBranches={allBranches}
          allCommits={allCommits}
          onDialogClose={() => this.setState({ isAddingSendRequest: false })}
          onDialogSend={this.onSendClicked}
          showLoading={this.state.isLoading}
          showError={this.state.hasError}
        />
      </>
    );
  }

  onInputChanged = (name, event) => {
    this.setState({
      [name]: event.target.value
    });
  };

  onSendClicked = payload => {
    console.log(payload)
  };
}

SendRequestsSubView.displayName = 'SendRequestsSubView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]].sendRequests,
    allClients: state.views.programmerView.allClients,
    allBranches: state.views.programmerView.allBranches,
    allCommits: state.views.programmerView.allCommits
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction,
      getAll: getAll
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
