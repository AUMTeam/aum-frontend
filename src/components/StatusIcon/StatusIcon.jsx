import { withStyles } from '@material-ui/core';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Schedule from '@material-ui/icons/Schedule';
import PropTypes from 'prop-types';
import React from 'react';

const approvedIconStyle = theme => ({
  icon: { color: theme.palette.approved }
});

/**
 * Used to display icons according to the values of INSTALL_STATUS and APPROVAL_STATUS enums.
 * A status of 0 means "pending", otherwise "successful" or "approved" if higher than 0 and
 * "failed" or "rejected" if less than 0.
 */
class StatusIcon extends React.PureComponent {
  render() {
    const { classes, status, opacity } = this.props;
    const opacityStyle = opacity != null ? { filter: `opacity(${opacity}%)` } : undefined;

    // prettier-ignore
    if (status < 0)
      return <HighlightOff color="error" style={opacityStyle} />;
    else if (status === 0)
      return <Schedule color="action" style={opacityStyle} />;
    else
      return <CheckCircleOutline className={classes.icon} style={opacityStyle} />;
  }
}

StatusIcon.displayName = 'StatusIcon';
StatusIcon.propTypes = {
  status: PropTypes.number.isRequired,
  opacity: PropTypes.number
};

export default withStyles(approvedIconStyle)(StatusIcon);
