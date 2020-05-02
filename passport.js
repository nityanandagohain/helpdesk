const passport = require('passport')
const TwitterStrategy = require('passport-twitter-token')
    // const UserModel = require('./app/models/user.model.js');
const User = require('mongoose').model('User')
const twitterConfig = require('./twitter.config.js')

module.exports = function() {
    passport.use(new TwitterStrategy({
            consumerKey: twitterConfig.consumerKey,
            consumerSecret: twitterConfig.consumerSecret,
            includeEmail: true
        },
        function(token, tokenSecret, profile, done) {
            User.addTwitterUser(token, tokenSecret, profile, function(err, user) {
                return done(err, user);
            });
        },
    ));
};