import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import List from "../components/trello_component/List";
// import { Link } from 'react-router-dom'
// import { logout } from '../actions/authActions';
// import ActionButton from '../components/trello_component/actionButton';
// import { DragDropContext } from "react-beautiful-dnd";
// import { sort, fetchLists } from "../actions";
import axios from 'axios';
import Tweet from '../tweet/tweet';

class HelpDesk extends Component {
  state = {
    tweets: []
  }
  componentDidMount() {
    console.log(this.props.token)
    axios.get("/api/v1/twitter/getall", { headers: { 'x-auth-token': this.props.token } }).then(res => { console.log(res.data); this.setState({ tweets: res.data }) })
  }

  render() {
    console.log("ll", this.state.tweets);
    return (
      this.state.tweets.length >= 0 ?
        <div>
          <div className="body">
            {
          this.state.tweets ? 
          <div className="row">
            <div className="col s3">
              {this.state.tweets.map((tweet, index) => <Tweet key={tweet.id} tweet={tweet}/>)}
            </div>
            <div className="col s9">
              <p>Reply</p>
              </div>
              </div>
            :
            <div></div>
          }
          </div>
        </div> :
        <div>

        </div>
    );
  }
}

export default HelpDesk;