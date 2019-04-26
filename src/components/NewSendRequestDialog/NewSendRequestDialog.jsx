import { DialogTitle, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import SelectField from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';
import ResponsiveDialog from '../../components/ResponsiveDialog';

const styles = theme => ({
  input: {
    display: 'flex'
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      margin="normal"
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  console.log(props);

  return (
    <Chip
      className={props.selectProps.classes.chip}
      tabIndex={-1}
      label={props.data.label}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

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
  installationType: '',
  destClients: [],
  branch: '',
  commits: [],
  components: ''
};

class NewSendRequestDialog extends Component {
  constructor(props) {
    super(props);

    this.state = initialDialogState;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.listenForSuccessful && !nextProps.isLoading && !nextProps.isFailed && nextProps.isSuccessful) {
      this.onDialogClose();
    }
  }

  render() {
    const {
      classes,
      isLoadingClients,
      allClients,
      isLoadingBranches,
      allBranches,
      isLoadingCommits,
      allCommits,
      isLoading,
      isFailed
    } = this.props;
    const { title, description, installationType, destClients, branch, commits, components } = this.state;

    return (
      <ResponsiveDialog {...this.props} isLoading={isLoading && !isFailed}>
        <DialogTitle>Inserisci una nuova richiesta di invio</DialogTitle>
        <DialogContent>
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
                  label: 'Cliente/i',
                  InputLabelProps: {
                    shrink: true
                  }
                }}
                components={selectComponents}
                options={allClients}
                placeholder="Seleziona uno o più clienti"
                value={destClients}
                onChange={this.onSelectInputChanged('destClients')}
                isMulti
                isLoading={isLoadingClients}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
              <Select
                classes={classes}
                textFieldProps={{
                  label: 'Commits',
                  InputLabelProps: {
                    shrink: true
                  }
                }}
                components={selectComponents}
                options={allCommits}
                placeholder="Seleziona uno o più commit"
                value={commits}
                onChange={this.onSelectInputChanged('commits')}
                isMulti
                isLoading={isLoadingCommits}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                label="Componenti"
                margin="normal"
                variant="outlined"
                fullWidth
                value={components}
                onChange={event => this.onInputChanged('components', event)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl variant="outlined" fullWidth style={{ marginTop: 16 }}>
                <InputLabel htmlFor="installationType">Tipo installazione</InputLabel>
                <SelectField
                  value={installationType}
                  onChange={event => this.onInputChanged('installationType', event)}
                  input={<OutlinedInput id="installationType" labelWidth={128 /* Hardcoded value */} />}
                >
                  {/* Here we will make a server call to get all the installtion types */}
                  <MenuItem value={0}>A caldo</MenuItem>
                  <MenuItem value={1}>A freddo</MenuItem>
                </SelectField>
              </FormControl>
            </Grid>
            {isFailed && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  Errore durante l'aggiunta di una nuova richiesta di invio, riprova.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.onDialogClose()}>
            Annulla
          </Button>
          <Button color="primary" onClick={() => this.onDialogSend()}>
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
    const { title, description, installationType, destClients, branch, commits, components } = this.state;

    onDialogSend({
      title,
      description,
      install_type: installationType,
      dest_clients: destClients.map(element => element.value),
      branch: branch.value,
      commits: commits.map(element => element.value),
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

NewSendRequestDialog.displayName = 'NewSendRequestDialog';
NewSendRequestDialog.propTypes = {
  isLoadingClients: PropTypes.bool.isRequired,
  allClients: PropTypes.object.isRequired,
  isLoadingBranches: PropTypes.bool.isRequired,
  allBranches: PropTypes.object.isRequired,
  isLoadingCommits: PropTypes.bool.isRequired,
  allCommits: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSuccessful: PropTypes.bool.isRequired,
  isFailed: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  onDialogSend: PropTypes.func.isRequired,
  listenForSuccessful: PropTypes.bool.isRequired
};

export default withStyles(styles, { withTheme: true })(NewSendRequestDialog);
