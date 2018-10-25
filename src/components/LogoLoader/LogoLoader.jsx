import { withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import gesbank_logo from '../../assets/gesbank_logo.png';

const styles = {
  root: {
    flexGrow: 1,
    position: 'absolute',
    height: '100%'
  },
  logo: {
      maxWidth: '100%',
      width: 'auto',
      height: 256
  }
};

/**
 * @class
 * This class is resposible of displaying a circular
 * progress bar when the webapp is loading some content.
 */
class LogoLoader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid
        className={classes.root}
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={16}
      >
        <Grid item>
          <img className={classes.logo} src={gesbank_logo} />
        </Grid>
        <Grid item>
          <CircularProgress className={classes.progress} color="primary" />
        </Grid>
      </Grid>
    );
  }
}

LogoLoader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LogoLoader);
