import React, { Component } from 'react';
import TwitterLogin from 'react-twitter-auth';
import Container from '@material-ui/core/Container';
import HelpDesk from './components/helpdesk/helpdesk';
import TopBar from './components/topbar/topbar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import "./App.css"
import axios from 'axios';

class App extends Component {

  state = { isAuthenticated: false, user: null, token: '', tweets: [] };

  componentDidMount() {
    let token = localStorage.getItem("token");
    let user = localStorage.getItem("user");
    if (token) {
      this.setState({ isAuthenticated: true, user: user, token: token });
    }
  }
  onSuccess = (response) => {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        this.setState({ isAuthenticated: true, user: user, token: token });
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
      }
    });
  };

  onFailed = (error) => {
    alert(error);
  };

  logout = () => {
    this.setState({ isAuthenticated: false, token: '', user: null })
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  render() {
    let content = !!this.state.isAuthenticated ?
      (
        <div className="container">
          <HelpDesk token={this.state.token} />
        </div>

      ) :
      (
        <Container>
          <Card className="card">
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Twitter Helpdesk
                </Typography>
                <TwitterLogin loginUrl="/api/v1/auth/twitter"
                  onFailure={this.onFailed} onSuccess={this.onSuccess}
                  requestTokenUrl="/api/v1/auth/twitter/reverse" />
              </CardContent>
            </CardActionArea>
          </Card>
        </Container>
      );

    return (
      <div className="App">
        <TopBar isAuthenticated={this.state.isAuthenticated} logout={this.logout} />
        {content}
      </div>
    );
  }
}

export default App;