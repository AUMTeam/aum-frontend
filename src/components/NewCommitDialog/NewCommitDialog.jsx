import { DialogTitle, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';
import ResponsiveDialog from '../../components/ResponsiveDialog';
import { Control, Menu, MultiValue, NoOptionsMessage, ValueContainer } from '../Select';
import { selectDialogStyles } from '../../views/styles';

const selectComponents = {
  NoOptionsMessage,
  Control,
  ValueContainer,
  MultiValue,
  Menu
};

const initialDialogState = {
  title: '',
  description: '',
  branch: '',
  components: ''
};

class NewCommitDialog extends Component {
  constructor(props) {
    super(props);

    this.state = initialDialogState;
  }

  render() {
    const { classes, isLoadingBranches, allBranches, isLoading, isFailed, isSuccessful, ...otherProps } = this.props;
    const { title, description, branch, components } = this.state;

    if (!isLoading && !isFailed && isSuccessful) this.onDialogClose();

    return (
      <ResponsiveDialog {...otherProps} isLoading={isLoading && !isFailed} scroll="body">
        <DialogTitle>Inserisci un nuovo commit</DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                label="Titolo"
                margin="normal"
                variant="outlined"
                fullWidth
                value={title}
                onChange={event => this.onInputChanged('title', event)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descrizione"
                margin="normal"
                variant="outlined"
                fullWidth
                value={description}
                onChange={event => this.onInputChanged('description', event)}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                classes={classes}
                textFieldProps={{
                  label: 'Branch',
                  InputLabelProps: {
                    shrink: true
                  }
                }}
                options={allBranches}
                components={selectComponents}
                value={branch}
                onChange={this.onSelectInputChanged('branch')}
                placeholder="Seleziona un branch"
                isClearable
                isLoading={isLoadingBranches}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Componenti"
                margin="normal"
                variant="outlined"
                fullWidth
                value={components}
                onChange={event => this.onInputChanged('components', event)}
              />
            </Grid>
            {isFailed && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  Errore durante l'aggiunta di un nuovo commit, riprova.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onDialogClose}>
            Annulla
          </Button>
          <Button color="primary" onClick={this.onDialogSend}>
            Invia
          </Button>
        </DialogActions>
      </ResponsiveDialog>
    );
  }

  onDialogClose = () => {
    const { onDialogClose } = this.props;

    this.setState(initialDialogState);

    onDialogClose();
  };

  onDialogSend = () => {
    const { onDialogSend } = this.props;
    const { title, description, branch, components } = this.state;

    onDialogSend({
      title,
      description,
      branch: branch.value,
      components
    });
  };

  onInputChanged = (name, event) => {
    this.setState({
      [name]: event.target.value
    });
  };

  onSelectInputChanged = name => value => {
    this.setState({
      [name]: value
    });
  };
}

NewCommitDialog.displayName = 'NewCommitDialog';
NewCommitDialog.propTypes = {
  isLoadingBranches: PropTypes.bool.isRequired,
  allBranches: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSuccessful: PropTypes.bool.isRequired,
  isFailed: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  onDialogSend: PropTypes.func.isRequired
};

export default withStyles(selectDialogStyles)(NewCommitDialog);
