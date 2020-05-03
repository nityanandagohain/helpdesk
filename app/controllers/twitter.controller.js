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