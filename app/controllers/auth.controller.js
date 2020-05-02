// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const registerValidator = require("../validators/register.validator.js");
// const loginValidator = require("../validators/login.validator.js");
// const User = require("../models/user.model.js");

const twitterConfig = require('../../twitter.config.js');
const User = require('../models/user.model.js');
const request = require('request')

exports.reverse = (req, res) => {
    request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
            oauth_callback: "http://localhost:3000/twitter-callback",
            consumer_key: twitterConfig.consumerKey,
            consumer_secret: twitterConfig.consumerSecret
        }
    }, function(err, r, body) {
        if (err) {
            return res.send(500, { message: e.message });
        }
        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
    });
}

exports.twitter = (req, res, next) => {
    request.post({
            url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
            oauth: {
                consumer_key: twitterConfig.consumerKey,
                consumer_secret: twitterConfig.consumerSecret,
                token: req.query.oauth_token
            },
            form: { oauth_verifier: req.query.oauth_verifier }
        },
        function(err, r, body) {
            if (err) {
                return res.send(500, { message: err.message });
            }

            const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            const parsedBody = JSON.parse(bodyString);

            req.body['oauth_token'] = parsedBody.oauth_token;
            req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
            req.body['user_id'] = parsedBody.user_id;

            next();
        });
}


exports.prepareTokenWithuserID = (req, res, next) => {
    if (!req.user) {
        return res.send(401, 'User Not Authenticated');
    }

    // prepare token for API
    req.auth = {
        id: req.user.id
    };

    return next();
}