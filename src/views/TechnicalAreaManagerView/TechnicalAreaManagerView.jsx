/* eslint-disable default-case */
import React from 'react';
import { connect } from 'react-redux';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { NAVIGATION_HIERARCHY } from '../../constants/navigation';
import CommitsRevisionSubView from './CommitsRevisionSubView';
import SendRequestsRevisionSubView from './SendRequestsRevisionSubView';
import { TECHNICAL_AREA_MANAGER_ACTION_TYPE } from '../../redux/actions/views/technicalAreaManager';

class TechnicalAreaManagerView extends React.Component {
  componentWillUnmount() {
    this.props.resetUI();
  }

  render() {
    switch (this.props.match.params.value) {
      case NAVIGATION_HIERARCHY[1].tabs[0].value:
        return <CommitsRevisionSubView />;
      case NAVIGATION_HIERARCHY[1].tabs[1].value:
        return <SendRequestsRevisionSubView />;
    }
  }
}

TechnicalAreaManagerView.displayName = 'TechnicalAreaManagerView';

const mapDispatchToProps = dispatch => {
  return {
    resetUI: () => dispatch({ type: TECHNICAL_AREA_MANAGER_ACTION_TYPE.RESET_UI })
  };
};

export default withErrorBoundary(
  connect(
    null,
    mapDispatchToProps
  )(TechnicalAreaManagerView)
);
