import Typography from '@material-ui/core/Typography';
import React from 'react';
import sad_face_grey from '../../assets/sad_face_grey.png';
import { getReactComponentName } from '../../utils/componentUtils';

const errorBoxStyle = {
  maxWidth: '700px',
  margin: 'auto',
  padding: '12vmin 16px'
};

const errorIconStyle = {
  width: '200px',
  paddingBottom: '24px',
  display: 'block',
  margin: 'auto'
};

/**
 * Returns the name of the component at the top most position of the React stack trace
 * (which is the one that raised the error).
 * A typical React component looks like that:
 *   in COMPONENT (at file.jsx:5)
 *   in COMPONENT2 (at file2.jsx:45)
 *   etc...
 */
function getTopMostStackEntryComponent(componentStack) {
  // We start looking for the first line wrap after the first character since stack traces start with a '/n'
  const topMostEntry = componentStack.slice(0, componentStack.indexOf('\n', 1)).trim();
  // At this point topMostEntry contains a string like "in COMPONENT (at FILE:LINE)"
  return topMostEntry.split(' ')[1];
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
        error: null,
        faultyComponentName: '' // name of the component that raised the error
      };
    }

    // Component name shown in DevTools and stack traces
    static displayName = `WithErrorBoundary(${getReactComponentName(Component)})`;

    static getDerivedStateFromError(error) {
      return { errorReceived: true, error };
    }

    componentDidCatch(error, info) {
      const faultyComponentName = getTopMostStackEntryComponent(info.componentStack);
      console.error(
        `${error.name} occurred during ${faultyComponentName} rendering, stack trace:`,
        info.componentStack
      );
      this.setState({ faultyComponentName });
    }

    render() {
      const { errorReceived, error, faultyComponentName } = this.state;
      return errorReceived ? (
        <div style={errorBoxStyle}>
          <img alt="Sad face" src={sad_face_grey} style={errorIconStyle} />
          <Typography align="center" variant="h2" paragraph>
            Oops!
          </Typography>
          <Typography align="center" variant="subtitle1" paragraph>
            Si è verificato un errore imprevisto durante il caricamento della schermata.
            <br />
            Segnalaci il problema riportando le informazioni sottostanti:
          </Typography>
          <Typography style={{ paddingLeft: '20%' }} variant="body2">
            <b>Route corrente:</b> {window.location.hash}
            <br />
            <b>Componente in cui è avvenuto l'errore:</b> {faultyComponentName}
            <br />
            <b>Tipo dell'errore:</b> {error.name}
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
