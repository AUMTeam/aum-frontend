import { withStyles } from '@material-ui/core';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Schedule from '@material-ui/icons/Schedule';
import PropTypes from 'prop-types';
import React from 'react';
import { APPROVAL_STATUS } from '../../constants/elements';

const approvedIconStyle = theme => ({
  icon: { color: theme.palette.approved }
});

class ApprovalStatusIcon extends React.PureComponent {
  render() {
    const { classes, status, opacity } = this.props;
    const opacityStyle =
      opacity != null
        ? { filter: `opacity(${opacity}%)` }
        : undefined;

    switch (status) {
      case APPROVAL_STATUS.DELIVERED:
      case APPROVAL_STATUS.APPROVED:
        return <CheckCircleOutline className={classes.icon} style={opacityStyle} />;
      case APPROVAL_STATUS.PENDING:
        return <Schedule color="action" style={opacityStyle} />;
      case APPROVAL_STATUS.REJECTED:
        return <HighlightOff color="error" style={opacityStyle} />;
      default:
        return <></>;
    }
  }
}

ApprovalStatusIcon.displayName = 'ApprovalStatusIcon';
ApprovalStatusIcon.propTypes = {
  status: PropTypes.oneOf([
    APPROVAL_STATUS.APPROVED,
    APPROVAL_STATUS.PENDING,
    APPROVAL_STATUS.REJECTED,
    APPROVAL_STATUS.DELIVERED
  ]).isRequired,
  opacity: PropTypes.number
};

export default withStyles(approvedIconStyle)(ApprovalStatusIcon);
