import { DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ResponsiveDialog from '../../components/ResponsiveDialog';

export default class NewSendRequestDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      branch: '',
      client: '',
      clientContact: '',
      motivation: '',
      installationType: ''
    };
  }

  render() {
    const { onDialogClose, onDialogSend, showLoading, showError } = this.props;
    const { title, description, installationType, destClients, branch, commits, components } = this.state;

    return (
      <ResponsiveDialog {...this.props} isLoading={showLoading && !showError}>
        <DialogTitle>Inserisci una nuova richiesta di invio</DialogTitle>
        <DialogContent>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                label="Titolo"
                margin="normal"
                variant="outlined"
                fullWidth={true}
                value={title}
                onChange={event => this.onInputChanged('title', event)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descrizione"
                margin="normal"
                variant="outlined"
                fullWidth={true}
                value={description}
                onChange={event => this.onInputChanged('description', event)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Clienti"
                margin="normal"
                variant="outlined"
                fullWidth={true}
                value={destClients}
                onChange={event => this.onInputChanged('destClients', event)}
              />
            </Grid>
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
                label="Commits"
                margin="normal"
                variant="outlined"
                fullWidth={true}
                value={commits}
                onChange={event => this.onInputChanged('commits', event)}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                label="Componenti"
                margin="normal"
                variant="outlined"
                fullWidth={true}
                value={components}
                onChange={event => this.onInputChanged('components', event)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl variant="outlined" fullWidth={true} style={{ marginTop: 16 }}>
                <InputLabel htmlFor="installationType">Tipo installazione</InputLabel>
                <Select
                  value={installationType}
                  onChange={event => this.onInputChanged('installationType', event)}
                  input={<OutlinedInput id="installationType" labelWidth={128 /* Hardcoded value */} />}
                >
                  {/* Here we will make a server call to get all the installtion types */}
                  <MenuItem value={0}>A caldo</MenuItem>
                  <MenuItem value={1}>A freddo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {showError && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  Errore durante l'aggiunta di una nuova richiesta di invio, riprova.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onDialogClose}>
            Annulla
          </Button>
          <Button
            color="primary"
            onClick={() =>
              onDialogSend({
                ciao: 'ciao'
              })
            }
          >
            Invia
          </Button>
        </DialogActions>
      </ResponsiveDialog>
    );
  }

  onInputChanged = (name, event) => {
    this.setState({
      [name]: event.target.value
    });
  };
}

NewSendRequestDialog.displayName = 'NewSendRequestDialog';
NewSendRequestDialog.propTypes = {
  onDialogClose: PropTypes.func.isRequired,
  onDialogSend: PropTypes.func.isRequired,
  showLoading: PropTypes.bool.isRequired,
  showError: PropTypes.bool.isRequired
};
