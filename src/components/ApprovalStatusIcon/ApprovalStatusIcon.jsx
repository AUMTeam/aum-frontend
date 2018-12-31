import React from 'react';
import PropTypes from 'prop-types';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Schedule from '@material-ui/icons/Schedule';
import { APPROVAL_STATUS } from '../../constants/commits';

const approvedIconStyle = {
  color: '#2eb72c'
};

export default class ApprovalStatusIcon extends React.PureComponent {
  render() {
    switch (this.props.status) {
      case APPROVAL_STATUS.APPROVED:
        return <CheckCircleOutline style={approvedIconStyle} />;
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
