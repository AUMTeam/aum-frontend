import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestLogin } from './actions/login';
import './App.css';
import Navigation from './components/Navigation/Navigation';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingPosts: props.isLoadingPosts
    }

    this.onButtonClicked = this.onButtonClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isLoadingPosts: nextProps.isLoadingPosts });
  }

  render() {
    return (
      <div className="app">
        <Navigation />
        {this.state.isLoadingPosts !== undefined ? this.state.isLoadingPosts ? <p>Caricamento post</p> : <p>I post sono stati caricati</p> : <p>Scarica i post con il pulsante sottostante</p>}
        <Button className="red download-posts-button" onClick={this.onButtonClicked}>
          Scarica post
        </Button>
        <div>
          {this.props.posts !== undefined ? this.props.posts.map((post, index) => <p key={index}>{post.body}</p>) : null}
        </div>
      </div>
    );
  }

  onButtonClicked() {
    this.props.requestLogin();
  }
}

const mapStateToProps = state => {
  return {
    posts: state.login.posts,
    isLoadingPosts: state.login.isLoadingPosts
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      requestLogin
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
