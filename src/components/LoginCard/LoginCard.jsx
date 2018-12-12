import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { attemptLoginAction } from '../../redux/actions/auth';
import { ENTER_KEY } from '../../constants/keyboard';

const styles = theme => ({
  card: {
    maxHeight: 512,
    maxWidth: 512,
    margin: 16
  },
  root: {
    padding: 16
  },
  loginButton: {
    width: 56
  }
});

class LoginCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      usernameError: false,
      passwordError: false
    };

    this.onInputChanged = this.onInputChanged.bind(this);
    this.onLoginButtonClicked = this.onLoginButtonClicked.bind(this);
    this.onEnterKeyClicked = this.onEnterKeyClicked.bind(this);
    this.checkTextFields = this.checkTextFields.bind(this);
  }

  render() {
    const { classes } = this.props;
    const { username, password, usernameError, passwordError } = this.state;
    return (
      <Card className={classes.card} onKeyDown={this.onEnterKeyClicked}>
        <Grid className={classes.root} container spacing={24}>
          <Grid item xs={12}>
            <Grid container justify="flex-start" alignContent="center">
              <Grid item xs={12}>
                <Typography variant="h4" component="h2">
                  Gesbank Evolution
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="textSecondary">
                  Benvenuto in Authorization Manager
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormControl style={{ marginBottom: -8 }} error={usernameError} fullWidth={true}>
              <TextField
                label="Username"
                type="text"
                variant="outlined"
                error={usernameError}
                autoFocus={true}
                value={username}
                onChange={event => this.onInputChanged('username', event)}
              />
              {usernameError && <FormHelperText>Devi inserire uno username</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl error={passwordError} fullWidth={true}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                error={passwordError}
                value={password}
                onChange={event => this.onInputChanged('password', event)}
              />
              {passwordError && <FormHelperText>Devi inserire una password</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="flex-end" alignContent="center">
              <Grid item>
                <Button
                  className={classes.loginButton}
                  size="large"
                  variant="contained"
                  color="secondary"
                  onClick={this.onLoginButtonClicked}
                  onKeyPress={this.onLoginButtonClicked}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Snackbar
          open={this.props.loginErrorMessage != null}
          message={<span>{this.props.loginErrorMessage}</span>}
        />
      </Card>
    );
  }

  onInputChanged(name, event) {
    this.setState({
      [name]: event.target.value,
      usernameError: false,
      passwordError: false
    });
  }

  onLoginButtonClicked() {
    const { username, password } = this.state;

    if (this.checkTextFields()) {
      this.props.attemptLoginAction(username, password);
    }
  }

  onEnterKeyClicked(event) {
      if (event.key === ENTER_KEY) {
        this.onLoginButtonClicked();
      }
  }

  checkTextFields() {
    const { username, password } = this.state;

    if (this.validateField(username) && this.validateField(password)) {
      this.setState({
        usernameError: true,
        passwordError: true
      });

      return false;
    } else if (this.validateField(username)) {
      this.setState({
        usernameError: true,
        passwordError: false
      });

      return false;
    } else if (this.validateField(password)) {
      this.setState({
        usernameError: false,
        passwordError: true
      });

      return false;
    }

    return true;
  }

  validateField(value) {
    return value.length === 0;
  }
}

LoginCard.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    isAttemptingLogin: state.auth.isAttemptingLogin,
    loginErrorMessage: state.auth.loginErrorMessage
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      attemptLoginAction
    },
    dispatch
  );
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginCard)
);
