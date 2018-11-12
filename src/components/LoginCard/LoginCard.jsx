import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { attemptLogin } from '../../actions/auth';
import './LoginCard.css';
import { Grid } from '@material-ui/core';

const styles = {
  card: {
    minWidth: 450,
    marginTop: 200
  },
  textField: {
    width: 390
  },
  button: {
    marginTop: 16
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
};

class LoginCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid
          spacing={16}
          xs={12} // FIXME it shouldn't be used here, but it is bugged without it!
          container
          justify="center"
          alignItems="center"
        >
          <Card className={classes.card}>
            <CardContent>
              <Typography gutterBottom variant="h4" component="h2">
                Gesbank Evolution
              </Typography>
              <Typography gutterBottom variant="subtitle1" color="textSecondary">
                Benvenuto in Authorization Manager
              </Typography>
              <TextField
                id="username-field"
                label="Username"
                placeholder=""
                multiline // FIXME bugged without it!
                className={classes.textField}
                margin="normal"
              />
              <br />
              <TextField
                id="password-field"
                label="Password"
                placeholder=""
                multiline // FIXME bugged without it!
                className={classes.textField}
                type="password"
                margin="normal"
              />
              <Grid container justify="flex-end" alignItems="flex-start">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.button}
                  onClick={() => this.props.attemptLogin(this.state.username, this.state.password)}
                >
                  Login
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAttemptingLogin: state.auth.isAttemptingLogin,
    loginErrorMessage: state.auth.loginErrorMessage
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      attemptLogin
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
