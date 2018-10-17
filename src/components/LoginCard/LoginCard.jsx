import React, { Component } from 'react';
import { Col, Card, Row, Button, Input } from 'react-materialize';
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
        <Row>
          <Col m={12} />
        </Row>
        <Row>
          <Col m={12} />
        </Row>
        <Row>
          <Col m={12} />
        </Row>
        <Row>
          <Col m={12} />
        </Row>
        <Row>
          <Col m={12} />
        </Row>
        <Row>
          <Col m={12} />
        </Row>
        <Row>
          <Col m={12} />
        </Row>
        <Row>
          <Col m={12} />
        </Row>
        <Row>
          <Col offset="m4" s={12} m={4}>
            <Card
              className="white"
              textClassName="white-text"
              title="Benvenuto in Authorization Manager"
            >
              <span id="black"> Effettua il login con il tuo account</span>
              <br />

              <Input
                s={8}
                label="Nome utente"
                value={this.state.username}
                onChange={evt => this.setState({username: evt.target.value})}   // FIXME
              />
              <Input
                s={8}
                type="password"
                label="Password"
                value={this.state.password}
                onChange={evt => this.setState({password: evt.target.value})}
              />
              <Row>
                <Col s={8}>
                  <a href="#">Hai dimenticato la password?</a>
                </Col>
                <Col s={4}>
                  <Button
                    onClick={() =>
                      this.props.onLoginBtnClicked(
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

export default LoginCard;
