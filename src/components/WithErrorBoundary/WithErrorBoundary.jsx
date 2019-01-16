import Typography from '@material-ui/core/Typography';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import React from 'react';

const errorBoxStyle = {
  maxWidth: '700px',
  margin: 'auto',
  padding: '12vmin 16px'
};

const errorIconStyle = {
  fontSize: '180px',
  paddingBottom: '8px',
  display: 'block',
  margin: 'auto'
};

function getComponentName(component) {
  return component.displayName || component.name || '[anonymous]';
}

/**
 * Higher-order component which wraps a component in an error boundary in order to
 * catch exceptions during rendering and report the error to the user.
 * Docs about these topics:
 *   https://reactjs.org/docs/higher-order-components.html
 *   https://reactjs.org/docs/error-boundaries.html
 * @param {*} Component the component which must be wrapped
 */
export default function withErrorBoundary(Component) {
  return class WithErrorBoundary extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        errorReceived: false,
        error: null
      };
    }

    // Component name shown in DevTools and debug stack traces
    static displayName = `WithErrorBoundary(${getComponentName(Component)})`;

    static getDerivedStateFromError(error) {
      return { errorReceived: true, error };
    }

    componentDidCatch(error, info) {
      console.error(`${error.name} during ${getComponentName(Component)} rendering, stack trace:`, info.componentStack);
    }

    render() {
      const { errorReceived, error } = this.state;
      return errorReceived ? (
        <div style={errorBoxStyle}>
          <ErrorOutline color="error" style={errorIconStyle} />
          <Typography align="center" variant="h2" paragraph>
            Oops!
          </Typography>
          <Typography align="center" variant="subtitle1" paragraph>
            Si è verificato un errore imprevisto durante il caricamento della schermata.
            <br />
            Segnalaci il problema riportando le informazioni sottostanti:
          </Typography>
          <Typography style={{ paddingLeft: '15%' }} variant="body2">
            <b>Tipo dell'errore:</b> {error.name}
            <br />
            <b>Componente in cui è stato catturato:</b> {getComponentName(Component)}
            <br />
            <b>Messaggio:</b> {error.message}
            <br />
            <i>(maggiori dettagli visibili nella console sviluppatore)</i>
          </Typography>
        </div>
      ) : (
        <Component {...this.props} />
      );
    }
  };
}
