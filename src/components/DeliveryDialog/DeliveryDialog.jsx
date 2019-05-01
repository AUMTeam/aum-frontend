import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import ResponsiveDialog from '../../components/ResponsiveDialog';
import { COMMON_ELEMENT_ATTRIBUTE, SEND_REQUEST_ATTRIBUTE, ATTRIBUTE_LABEL } from '../../constants/elements';
import { renderElementFieldContent } from '../../utils/viewUtils';

const buttonToTheLeftStyle = {
  marginRight: 'auto'
};

export default class DeliveryDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      installLink: '',
      displayMissingLinkError: false
    };
  }

  render() {
    const { sendRequest, onSend, onClose, onDetailsClick, displayError, ...otherProps } = this.props;

    return (
      <ResponsiveDialog {...otherProps}>
        {otherProps.open && (
          <>
            <DialogTitle>
              {`Invia patch #${sendRequest.id}: ${sendRequest[COMMON_ELEMENT_ATTRIBUTE.TITLE]}`}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    {ATTRIBUTE_LABEL[COMMON_ELEMENT_ATTRIBUTE.DESCRIPTION]}
                  </Typography>
                  <Typography variant="body1">{sendRequest[COMMON_ELEMENT_ATTRIBUTE.DESCRIPTION]}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    {ATTRIBUTE_LABEL[SEND_REQUEST_ATTRIBUTE.RECIPIENT_CLIENTS]}
                  </Typography>
                  <Typography variant="body1">
                    {renderElementFieldContent(
                      SEND_REQUEST_ATTRIBUTE.RECIPIENT_CLIENTS,
                      sendRequest[SEND_REQUEST_ATTRIBUTE.RECIPIENT_CLIENTS]
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    {ATTRIBUTE_LABEL[COMMON_ELEMENT_ATTRIBUTE.BRANCH]}
                  </Typography>
                  <Typography variant="body1">{sendRequest[COMMON_ELEMENT_ATTRIBUTE.BRANCH]}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    {ATTRIBUTE_LABEL[SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE]}
                  </Typography>
                  <Typography variant="body1">
                    {renderElementFieldContent(
                      SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE,
                      sendRequest[SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE]
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Link di installazione"
                    placeholder="Specifica un indirizzo"
                    value={this.state.installLink}
                    onChange={this.handleLinkTextFieldChange}
                    error={this.state.displayMissingLinkError}
                    style={{ marginTop: '8px' }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {displayError && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="error">
                      Si è verificato un errore durante l'invio. Riprova.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onDetailsClick} color="primary" style={buttonToTheLeftStyle}>
                Più dettagli
              </Button>
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

  handleLinkTextFieldChange = event => {
    this.setState({
      displayMissingLinkError: false,
      installLink: event.target.value
    });
  };

  // prettier-ignore
  handleSendButtonClick = () => {
    const { sendRequest, onSend } = this.props;

    if (this.state.installLink.trim() === '')
      this.setState({ displayMissingLinkError: true });
    else
      onSend(sendRequest.id, this.state.installLink);
  };
}

DeliveryDialog.defaultProps = {
  displayError: false
};

DeliveryDialog.propTypes = {
  sendRequest: PropTypes.object.isRequired,
  onSend: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onDetailsClick: PropTypes.func.isRequired,
  displayError: PropTypes.bool
};
