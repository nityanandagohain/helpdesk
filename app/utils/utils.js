const jwt = require('jsonwebtoken')
const User = require('../models/user.model.js');
const Twitter = require("twitter")
const twitterConfig = require('../../twitter.config.js');


const createToken = (auth) => {
    return jwt.sign({
        id: auth.id
    }, 'my-secret', {
        expiresIn: 60 * 120
    });
}

const getTwitterClient = () => {
    return new Twitter({
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret,
        access_token_key: twitterConfig.accessToken,
        access_token_secret: twitterConfig.secretKey
    })
}

const getCurrentUser = (req, res, next) => {
    User.findById(req.auth.id, function(err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
}

const getOne = (req, res) => {
    var user = req.user.toObject();

    delete user['twitterProvider'];
    delete user['__v'];

    res.json(user);
}

const generateToken = (req, res, next) => {
    req.token = createToken(req.auth);
    return next();
}

const sendToken = (req, res) => {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
}

module.exports = {
    getCurrentUser,
    getOne,
    generateToken,
    sendToken,
    getTwitterClient
}