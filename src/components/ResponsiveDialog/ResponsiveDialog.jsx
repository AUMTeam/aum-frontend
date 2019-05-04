import { CircularProgress, withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  opaque: {
    zIndex: 10,
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.7)'
  }
};

/**
 * Dialog that resizes dynamically to fit screen size up to medium breakpoint (960px).
 * On mobile screens it becomes fullscreen.
 * Any given props will be passed down to the Dialog MaterialUI component.
 */
class ResponsiveDialog extends React.Component {
  render() {
    const { isLoading, classes, children, ...otherProps } = this.props;

    return (
      <Dialog fullWidth {...otherProps}>
        {isLoading && this.showLoader(classes)}
        {children}
      </Dialog>
    );
  }

  showLoader(jssClasses) {
    return (
      <Grid className={jssClasses.opaque} container alignItems="center" justify="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }
}

ResponsiveDialog.defaultProps = {
  isLoading: false,
  maxWidth: 'md',
  disableBackdropClick: true
}

ResponsiveDialog.displayName = 'ResponsiveDialog';
ResponsiveDialog.propTypes = {
  isLoading: PropTypes.bool
};

export default withStyles(styles)(withMobileDialog({ breakpoint: 'xs' })(ResponsiveDialog));
