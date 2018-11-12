import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
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
    marginTop: 200,
    

  },
  textField: {
    width: 390,
  },

  button:{
    marginTop: 16,
  },

  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
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
    const bull = <span className={classes.bullet}>•</span>;
    return (
      <div>
          <Grid
            spacing ={16}
            xs = {12}
            container
            justify="center"
            alignItems="center" 
          >
            <Card className={classes.card} >
              <CardContent>
                <Typography gutterBottom variant="h4" component="h2">
                  Gesbank Evolution 
                </Typography>
                <Typography gutterBottom variant="h7"  color="textSecondary">
                  Benvenuto in Authorization Manager
                </Typography>
                <TextField
                  id="standard-textarea1"
                  label="Username"
                  placeholder=""
                  multiline
                  className={classes.textField}
                  margin="normal"
                  
                />
                <br/>
                <TextField
                  id="standard-textarea2"
                  label="Password"
                  placeholder=""
                  multiline
                  className={classes.textField}
                  margin="normal"
                />
                <Grid
                  
                  container
                  justify="flex-end"
                  alignItems="flex-start"
                >
                  <Button variant="contained" color="primary" size = "large" className={classes.button}>
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
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      attemptLogin
    },
    dispatch
  );
}


export default withStyles(styles) (connect (
  mapStateToProps,
  mapDispatchToProps
)(LoginCard));