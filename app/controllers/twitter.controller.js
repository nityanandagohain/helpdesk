const utils = require("../utils/utils")
const User = require('mongoose').model('User')

exports.getTweets = async(req, res, next) => {
    console.log(req.auth.id)
    User.findOne({ "_id": req.auth.id }, (err, user) => {
        if (err) {
            return {}
        }
        const client = utils.getTwitterClient()
        const params = {
            exclude_replies: false,
            count: 50,
            screen_name: user.username
        };

        client.get(
            "statuses/user_timeline",
            params,
            (error, tweets, response) => {
                if (error) console.log(error);
                client.get(
                    "statuses/mentions_timeline", { count: 50 },
                    (err, mentionsTweets, response) => {
                        if (err) console.log(err);
                        res.json(mentionsTweets.concat(tweets));
                    }
                );
            }
        );
    });

}

exports.replyTweet = (req, res, next) => {
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