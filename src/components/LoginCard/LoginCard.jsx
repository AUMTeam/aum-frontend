import React, { Component } from 'react';
import { Col, Card, Row, Button, Input, ProgressBar } from 'react-materialize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { attemptLogin } from '../../actions/auth';
import './LoginCard.css';

class LoginCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }

  render() {
    return (
      <div>
        {/*Mimics a vertical alignment of the card (creates 8 rows)*/}
        {React.Children.map(Array(8), () => {
          return (
            <Row>
              <Col m={12} />
            </Row>
          )
        })}

        <Row>
          <Col offset="m4" s={12} m={4}>
            <ProgressBar className={(this.props.isAttemptingLogin ? '' : 'hide')} />
            <Card
              className="white"
              title="Benvenuto in Authorization Manager"
            >
              <span className="black-text"> Effettua il login con il tuo account</span>
              <br />

              <Input
                s={8}
                label="Nome utente"
                onChange={event => this.setState({username: event.target.value})}
              />
              <Input
                s={8}
                type="password"
                label="Password"
                onChange={event => this.setState({password: event.target.value})}
              />
              <Row>
                <Col s={8}>
                  <span className="red-text">{this.props.loginErrorMessage}</span>
                </Col>
                <Col s={4}>
                  <Button
                    onClick={() =>
                      this.props.attemptLogin(
                        this.state.username,
                        this.state.password
                      )
                    }
                    waves="light"
                    style={{ backgroundColor: 'blue' }}
                  >
                    Accedi
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginCard);
