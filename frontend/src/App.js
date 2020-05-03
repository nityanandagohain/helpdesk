import React, { Component } from 'react';
import TwitterLogin from 'react-twitter-auth';
// import axios from 'axios';
import HelpDesk from './components/helpdesk/helpdesk';

class App extends Component {

  state = { isAuthenticated: false, user: null, token: '', tweets : []};
  
  componentDidMount() {
    let token = localStorage.getItem("token");
    let user = localStorage.getItem("user");
    if (token){
      this.setState({isAuthenticated: true, user: user, token: token});
    }
  }
  onSuccess = (response) => {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        this.setState({isAuthenticated: true, user: user, token: token});
        localStorage.setItem("token", token)
        localStorage.setItem("user", user)
      }
    });
    
  };

  onFailed = (error) => {
    alert(error);
  };

  logout = () => {
    this.setState({isAuthenticated: false, token: '', user: null})
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  render() {
    let content = !!this.state.isAuthenticated ?
      (
        <div className="container">
          <p>Authenticated</p>
          <div>
            {this.state.user.email}
          </div>
          <HelpDesk token={this.state.token}/>
          <div>
            <button onClick={this.logout} className="button" >
              Log out
            </button>
          </div>
        </div>
        
      ) :
      (
        <TwitterLogin loginUrl="/api/v1/auth/twitter"
                      onFailure={this.onFailed} onSuccess={this.onSuccess}
                      requestTokenUrl="/api/v1/auth/twitter/reverse"/>
      );

    return (
      <div className="App">
        <div className="container">
        {content}
        </div>
      </div>
    );
  }
}

export default App;