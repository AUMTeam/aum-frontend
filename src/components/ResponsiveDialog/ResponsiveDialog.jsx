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
    const { isLoading } = this.props;

    return (
      <Dialog fullWidth maxWidth={'md'} disableBackdropClick {...this.props}>
        {isLoading && this.showLoader()}
        {this.props.children}
      </Dialog>
    );
  }

  showLoader() {
    const { classes } = this.props;

    return (
      <Grid className={classes.opaque} container alignItems="center" justify="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }
}

ResponsiveDialog.displayName = 'ResponsiveDialog';
ResponsiveDialog.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

export default withStyles(styles)(withMobileDialog({ breakpoint: 'xs' })(ResponsiveDialog));
