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
    height: 'auto'
  }
};

/**
 * @class
 * This class is resposible of displaying a circular
 * progress bar when the webapp is loading some content.
 */
class LogoLoader extends Component {
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
          <img className={classes.logo} src={gesbank_logo} alt="Gesbank Evolution" />
        </Grid>
        <Grid item>
          <CircularProgress className={classes.progress} color="secondary" />
        </Grid>
      </Grid>
    );
  }
}

LogoLoader.displayName = 'LogoLoader';
LogoLoader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LogoLoader);
