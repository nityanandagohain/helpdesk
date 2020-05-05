import React, { Component } from 'react';
import "./helpdesk.css"
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Linkify from 'react-linkify';
import moment from "moment";
import {
  ThemeProvider,
  ChatList,
  ChatListItem,
  Avatar,
  Column,
  Row,
  Title,
  Subtitle,
  Message,
  MessageList,
  MessageGroup,
  MessageText,
  TextComposer,
  TextInput,
  SendButton
} from "@livechat/ui-kit";
import axios from 'axios';

class HelpDesk extends Component {
  state = {
    tweets: [],
    currentID: "",
    replied: false,
    currentThread: [],
    message: "",
    threadSelected: false,
  }
  componentDidMount() {
    axios.get("/api/v1/twitter/getall", { headers: { 'x-auth-token': this.props.token } })
      .then((res) => {
        console.log(res)
        let data = res.data
        data = data.filter(tweet => !tweet.errors);
        data = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        this.setState({ tweets: data });
      })
      .catch((error) => {
        console.log("Request failed", error);
      });
  }

  fetchTweetThread = tweetID => {
    const { tweets } = this.state;
    const tweetsFromThread = [];
    const currentThread = [...tweets].reverse().filter(tweet => {
      if (
        tweet.id_str === tweetID ||
        tweet.in_reply_to_status_id_str === tweetID
      ) {
        tweetsFromThread.push(tweet.id_str);
        return true;
      } else {
        if (tweetsFromThread.indexOf(tweet.in_reply_to_status_id_str) > -1) {
          tweetsFromThread.push(tweet.id_str);
          return true;
        }
        return false;
      }
    });
    this.setState({ currentThread, currentID: tweetID, threadSelected: true });

    console.log(this.state.currentThread)
  };

  ReplyTweet = () => {
    const { message, currentThread, currentID } = this.state;
    this.setState({ replied: true });

    axios.post("/api/v1/twitter/", {
      status: `@${currentThread[0].user.screen_name} ${message}`,
      statusID: currentThread[0].id_str,
    }, { headers: { 'x-auth-token': this.props.token } })
      .then((data) => {
        data = data.data
        console.log("replied");
        const updatedTweets = [data, ...this.state.tweets].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        this.setState({ tweets: updatedTweets }, () => {
          this.fetchTweetThread(currentID);
          this.setState({ replied: false });
          // localStorage.setItem('stream-connected', true);
        });
      })
      .catch(function (error) {
        console.log("Request failed", error);
      });
  }

  updateNewStatus = (event) => {
    this.setState({ message: event.target.value });
  }

  render() {
    console.log("ll", this.state.tweets);
    const { tweets, currentID, replied, currentThread, threadSelected } = this.state;
    return (
      <div>
        {
          this.state.tweets ?
            <ThemeProvider>
              {tweets.length === 0 ? (
                <div className="progress-bar">
                  <CircularProgress style={{ margin: 12 }} />
                </div >
              ) : (
                  <div className="chat-container">
                    <Grid container spacing={0}>
                      <div className="scrollable-grid" item xs={4} lg={3} md={3}>
                        {TweetList(tweets, this.fetchTweetThread, currentID)}
                      </div>
                      <div className="new-grid"
                        item
                        xs={8}
                        lg={8}
                        md={8}
                        style={{ borderLeft: "1px solid #8080803d" }}
                      >
                        <div style={{ height: "70vh" }}>
                          {TweetThread(currentThread, replied)}
                        </div>
                        {
                          threadSelected ? <TextComposer
                            style={{ minHeight: 100 }}
                            onChange={this.updateNewStatus}
                            onSend={this.ReplyTweet}
                          >
                            <Row align="center">
                              <TextInput />
                              <SendButton fit />
                            </Row>
                          </TextComposer> :
                            <div></div>
                        }
                      </div>
                    </Grid>
                  </div>
                )}
            </ThemeProvider>
            :
            <div></div>
        }
      </div>
    );
  }
}

export default HelpDesk;

const TweetList = (tweets, fetchTweetThread, currentID) => {
  return (
    <ChatList>
      {tweets
        .filter(tweet => tweet.in_reply_to_status_id === null)
        .map(tweet => {
          return (
            <ChatListItem
              active={currentID === tweet.id_str}
              active={true}
              key={Number(tweet.id_str)}
              onClick={() => fetchTweetThread(tweet.id_str)}
            >
              <Avatar
                letter={tweet.user.name}
                imgUrl={tweet.user.profile_image_url_https}
              />
              <Column>
                <Row justify>
                  <Title ellipsis>{tweet.user.name}</Title>
                  <Subtitle nowrap>
                    {moment(new Date(tweet.created_at)).format("LT")}
                  </Subtitle>
                </Row>
                <Subtitle style={{ maxWidth: 100 }} ellipsis>{tweet.text}</Subtitle>
              </Column>
            </ChatListItem>
          );
        })}
    </ChatList>
  );
};

const TweetThread = (currentThread, replied) => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user, user.username)
  return (
    <MessageList active={true}>
      {currentThread.map((thread, index) => (
        <MessageGroup
          avatar={thread.user.profile_image_url_https}
          onlyFirstWithMeta
          key={index}
          isOwn={user.username === thread.user.screen_name}
        >
          <Message
            isOwn={user.username === thread.user.screen_name}
            authorName={
              user.username === thread.user.screen_name ? "Me" : thread.user.name
            }
            date={`${moment(new Date(thread.created_at)).format(
              "ll"
            )} at ${moment(new Date(thread.created_at)).format("LT")}`}
          >
            <Linkify><MessageText>{thread.text}</MessageText></Linkify>
          </Message>
        </MessageGroup>
      ))}
      {replied}
    </MessageList>
  );
};