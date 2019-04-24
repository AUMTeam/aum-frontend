import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core';

/**
 * Dialog that resizes dynamically to fit screen size up to medium breakpoint (960px).
 * On mobile screens it becomes fullscreen.
 * Any given props will be passed down to the Dialog MaterialUI component.
 */
class ResponsiveDialog extends React.Component {
  render() {
    return (
      <Dialog fullWidth maxWidth={'md'} disableBackdropClick {...this.props}>
        {this.props.children}
      </Dialog>
    );
  }
}

ResponsiveDialog.displayName = 'ResponsiveDialog';

export default withMobileDialog({ breakpoint: 'xs' })(ResponsiveDialog);
