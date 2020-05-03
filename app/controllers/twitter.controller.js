const utils = require("../utils/utils")

exports.getTweets = (req, res, next) => {
    const client = utils.getTwitterClient()
    const params = {
        exclude_replies: false,
        count: 50
    };
    client.get(
        "statuses/mentions_timeline",
        params,
        (error, mentionedTweets, response) => {
            if (error) console.log(error);
            client.get(
                "statuses/user_timeline", { count: 50 },
                (err, tweets, response) => {
                    const userTweets = tweets.filter(tweet => tweet.in_reply_to_status_id !== null);
                    if (err) console.log(err);
                    res.json(userTweets.concat(mentionedTweets));
                }
            );
        }
    );
}

exports.ReplyTweet = (req, res, next) => {
    const { statusID, status } = req.body;
    const client = utils.getTwitterClient()
    const params = {
        in_reply_to_status_id: statusID,
        status
    }
    client.post('/statuses/update', params, (error, tweet, response) => {
        if (error) res.sendStatus(500);
        res.json(tweet);
    })
}