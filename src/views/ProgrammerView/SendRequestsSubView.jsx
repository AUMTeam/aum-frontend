import { DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
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
import { performNewSearchAction } from '../../redux/actions/commonList';
import { retrieveSendRequestsListPageAction, startSendRequestsListUpdatesAutoCheckingAction, stopSendRequestsListUpdatesAutoCheckingAction } from '../../redux/actions/sendRequests';
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
    const { classes, sendRequestsData, retrieveSendRequestsListPage, performNewSearch } = this.props;
    const { isAddingSendRequest, branch, client, clientContact, motivation, installationType } = this.state;

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
        <ResponsiveDialog open={isAddingSendRequest}>
          <DialogTitle>Inserisci una nuova richiesta di invio</DialogTitle>
          <DialogContent>
            <Grid container spacing={16}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Branch"
                  margin="normal"
                  variant="outlined"
                  fullWidth={true}
                  value={branch}
                  onChange={event => this.onInputChanged('branch', event)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Cliente"
                  margin="normal"
                  variant="outlined"
                  fullWidth={true}
                  value={client}
                  onChange={event => this.onInputChanged('client', event)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Referente cliente"
                  margin="normal"
                  variant="outlined"
                  fullWidth={true}
                  value={clientContact}
                  onChange={event => this.onInputChanged('clientContact', event)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField id="content" label="Contenuto" margin="normal" variant="outlined" fullWidth={true} />
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  label="Motivazione"
                  margin="normal"
                  variant="outlined"
                  fullWidth={true}
                  value={motivation}
                  onChange={event => this.onInputChanged('motivation', event)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl className={classes.FormControl} variant="outlined" fullWidth={true}>
                  <InputLabel htmlFor="installationType">Tipo installazione</InputLabel>
                  <Select
                    value={installationType}
                    onChange={event => this.onInputChanged('installationType', event)}
                    input={<OutlinedInput id="installationType" labelWidth={128 /* Hardcoded value */} />}
                  >
                    {/* Here we will make a server call to get all the installtion types */}
                    <MenuItem value={0}>Fisica</MenuItem>
                    <MenuItem value={1}>Virtuale</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => this.setState({ isAddingSendRequest: false })}>
              Annulla
            </Button>
            <Button color="primary">Invia</Button>
          </DialogActions>
        </ResponsiveDialog>
      </>
    );
  }

  onInputChanged = (name, event) => {
    this.setState({
      [name]: event.target.value
    });
  };
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
