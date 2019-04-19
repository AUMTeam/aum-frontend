/* eslint-disable default-case */
import React, { Component } from 'react';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { NAVIGATION_HIERARCHY } from '../../constants/navigation';
import CommitsSubView from './CommitsSubView';
import SendRequestsSubView from './SendRequestsSubView';

/**
 * @class
 * This class is responsible for displaying the
 * components of the programmer view according to the selected tab
 */
class ProgrammerView extends Component {
  render() {
    switch (this.props.match.params.value) {
      case NAVIGATION_HIERARCHY[0].tabs[0].value:
        return <CommitsSubView />;
      case NAVIGATION_HIERARCHY[0].tabs[1].value:
        return <SendRequestsSubView />;
    }
  }
}

ProgrammerView.displayName = 'ProgrammerView';

export default withErrorBoundary(ProgrammerView);
