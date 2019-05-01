import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import ResponsiveDialog from '../../components/ResponsiveDialog';
import { COMMON_ELEMENT_ATTRIBUTE, INSTALL_STATUS, SEND_REQUEST_ATTRIBUTE } from '../../constants/elements';

export default class InstallFeedbackDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      installStatus: '',
      installFeedback: '',
      displayMissingInstallStatusError: false
    };
  }

  render() {
    const { sendRequest, onSend, onClose, isSending, displaySendError, ...otherProps } = this.props;

    return (
      <ResponsiveDialog isLoading={isSending} {...otherProps}>
        {otherProps.open && (
          <>
            <DialogTitle>
              {`Invia feedback per la patch del ${new Date(
                sendRequest[SEND_REQUEST_ATTRIBUTE.DELIVERY_TIMESTAMP] * 1000
              ).toLocaleDateString('it-it')}: ${sendRequest[COMMON_ELEMENT_ATTRIBUTE.TITLE]}`}
            </DialogTitle>
            <DialogContent>
              <Grid container alignItems="center" spacing={16}>
                <Grid item xs={12} sm={9}>
                  <Typography variant="body1">L'installazione è andata a buon fine?</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Select
                    fullWidth
                    onChange={this.handleSelectChange}
                    value={this.state.installStatus}
                    displayEmpty
                    input={<OutlinedInput labelWidth={0} />}
                    error={this.state.displayMissingInstallStatusError}
                  >
                    <MenuItem value="" disabled selected>
                      Seleziona
                    </MenuItem>
                    <MenuItem value={INSTALL_STATUS.INSTALL_SUCCESS}>Sì</MenuItem>
                    <MenuItem value={INSTALL_STATUS.INSTALL_FAILED}>No</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Fornisci un feedback (opzionale)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    variant="outlined"
                    value={this.state.installFeedback}
                    onChange={this.handleFeedbackTextChange}
                    style={{ marginTop: '8px' }}
                  />
                </Grid>

                {displaySendError && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="error">
                      Si è verificato un errore durante l'invio. Riprova.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Annulla
              </Button>
              <Button onClick={this.handleSendButtonClick} color="primary">
                Invia
              </Button>
            </DialogActions>
          </>
        )}
      </ResponsiveDialog>
    );
  }

  handleSelectChange = event => {
    this.setState({
      displayMissingInstallStatusError: false,
      installStatus: event.target.value
    });
  };

  handleFeedbackTextChange = event => {
    this.setState({ installFeedback: event.target.value });
  };

  handleSendButtonClick = () => {
    const { sendRequest, onSend } = this.props;

    // prettier-ignore
    if (this.state.installStatus === '')
      this.setState({ displayMissingInstallStatusError: true });
    else
      onSend(sendRequest.id, this.state.installStatus, this.state.installFeedback.trim());
  };
}

InstallFeedbackDialog.displayName = 'InstallFeedbackDialog';

InstallFeedbackDialog.propTypes = {
  sendRequest: PropTypes.object.isRequired,
  onSend: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isSending: PropTypes.bool,
  displaySendError: PropTypes.bool
};
