import React, { Component } from 'react';
import withErrorBoundary from '../../components/WithErrorBoundary';

class ClientView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    throw new Error("Errore di test.");
    return <></>;
  }
}

export default withErrorBoundary(ClientView);