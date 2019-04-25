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
import React, { Component } from 'react';
import ResponsiveDialog from '../../components/ResponsiveDialog';

export default class NewSendRequestDialog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            branch: '',
            client: '',
            clientContact: '',
            motivation: '',
            installationType: ''
        }
    }

    render() {
        const { onClose, onSend } = this.props;
        const { branch, client, clientContact, motivation, installationType } = this.state;

        return (
        <ResponsiveDialog {...this.props}>
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
                <FormControl variant="outlined" fullWidth={true}>
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={onClose}>
              Annulla
            </Button>
            <Button color="primary" onClick={() => onSend({
                branch,
                client,
                clientContact,
                motivation,
                installationType
            })}>Invia</Button>
          </DialogActions>
        </ResponsiveDialog>
        )
    }

    onInputChanged = (name, event) => {
        this.setState({
          [name]: event.target.value
        });
      };
}