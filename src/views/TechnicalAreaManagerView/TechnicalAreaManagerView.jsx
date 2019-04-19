/* eslint-disable default-case */
import React from 'react';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { NAVIGATION_HIERARCHY } from '../../constants/navigation';
import CommitsRevisionSubView from './CommitsRevisionSubView';
import SendRequestsRevisionSubView from './SendRequestsRevisionSubView';

class TechnicalAreaManagerView extends React.Component {
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

export default withErrorBoundary(TechnicalAreaManagerView);
