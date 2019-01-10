import { withStyles } from '@material-ui/core';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Schedule from '@material-ui/icons/Schedule';
import PropTypes from 'prop-types';
import React from 'react';
import { APPROVAL_STATUS } from '../../constants/listElements';

const approvedIconStyle = theme => ({
  icon: { color: theme.palette.approved }
});

class ApprovalStatusIcon extends React.PureComponent {
  render() {
    switch (this.props.status) {
      case APPROVAL_STATUS.APPROVED:
        return <CheckCircleOutline className={this.props.classes.icon} />;
      case APPROVAL_STATUS.PENDING:
        return <Schedule color="action" />;
      case APPROVAL_STATUS.REJECTED:
        return <HighlightOff color="error" />;
      default:
        return <></>;
    }
  }
}

ApprovalStatusIcon.propTypes = {
  status: PropTypes.oneOf([APPROVAL_STATUS.APPROVED, APPROVAL_STATUS.PENDING, APPROVAL_STATUS.REJECTED]).isRequired
};

export default withStyles(approvedIconStyle)(ApprovalStatusIcon);
