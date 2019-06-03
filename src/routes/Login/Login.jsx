import { Grid, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { attemptLoginAction } from '../../redux/actions/auth';
import ibt_logo from '../../assets/ibt_logo.png';

const styles = {
  root: {
    flexGrow: 1,
    position: 'absolute',
    height: '100%'
  },
  card: {
    maxWidth: 512,
    margin: 16,
    overflow: 'visible'
  },
  cardRoot: {
    padding: 16
  },
  loginButton: {
    width: 56
  },
  footer: {
    color: 'grey',
    textAlign: 'center',
    alignSelf: 'flex-end',
    padding: '0 16px 16px'
  },
  link: {
    color: 'inherit'
  },
  logo: {
    width: '130px'
  },
  welcomeText: {
    textAlign: 'center'
  }
};

/**
 * @class
 * This class represents the login page of the webapp.
 * In the login page the login form will be loaded, in order to let
 * the user log into the system.
 */
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      usernameError: false,
      passwordError: false
    };
  }

  render() {
    const { classes, isAttemptingLogin } = this.props;
    const { username, password, usernameError, passwordError } = this.state;
    return (
      <Grid className={classes.root} container justify="center" alignItems="center">
        <Card className={classes.card} onKeyDown={this.onEnterKeyClicked}>
          <Grid className={classes.cardRoot} container spacing={24}>
            <Grid item xs={12}>
              <Grid container justify="center" alignContent="center" spacing={8}>
                <Grid item>
                  <img className={classes.logo} src={ibt_logo} alt="Logo IBT" />
                </Grid>
                <Grid item xs={12} className={classes.welcomeText}>
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
                    disabled={isAttemptingLogin}
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
        </Card>

        <Grid item xs={12} className={classes.footer}>
          <Typography variant="caption" color="inherit">
            Realizzato da{' '}
            <a className={classes.link} href="http://www.ibttn.it">
              Informatica Bancaria Trentina
            </a>{' '}
            in collaborazione con alcuni studenti dell'
            <a className={classes.link} href="http://www.buonarroti.tn.it">
              I.T.T. Buonarroti-Pozzo
            </a>
            .
            <br />
            Questo software è{' '}
            <a className={classes.link} href="https://github.com/AUMTeam/aum-frontend">
              open-source
            </a>{' '}
            e rilasciato sotto licenza MIT.
          </Typography>
        </Grid>
      </Grid>
    );
  }

  /**
   * Updates value of username and password in component state
   * @param {*} name 'username' or 'password'
   * @param {*} event Event descriptor
   */
  onInputChanged = (name, event) => {
    this.setState({
      [name]: event.target.value,
      usernameError: false,
      passwordError: false
    });
  };

  /**
   * Triggers login action when button is clicked
   */
  onLoginButtonClicked = () => {
    const { username, password } = this.state;

    if (this.textFieldsAreValidated()) {
      this.props.attemptLogin(username, password);
    }
  };

  /**
   * Triggers login action when user presses enter in one of the input fields
   */
  onEnterKeyClicked = event => {
    if (event.key === 'Enter') {
      this.onLoginButtonClicked();
    }
  };

  /**
   * Checks if username and password fields' content is valid (they must not be empty)
   * Returns false if one of the two fields is empty and updates state accordingly
   */
  textFieldsAreValidated = () => {
    const { username, password } = this.state;
    const usernameError = username.length === 0;
    const passwordError = password.length === 0;

    if (usernameError || passwordError) {
      this.setState({
        usernameError,
        passwordError
      });
      return false;
    }

    return true;
  };
}

Login.displayName = 'Login';

const mapStateToProps = state => {
  return {
    isAttemptingLogin: state.auth.isAttemptingLogin
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      attemptLogin: attemptLoginAction
    },
    dispatch
  );
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
