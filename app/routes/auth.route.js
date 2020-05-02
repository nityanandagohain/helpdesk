const router = require("express").Router();
const users = require('../controllers/auth.controller.js');
const authenticate = require("../../authenticate");
const request = require('request')
const twitterConfig = require('../../twitter.config.js');
const passport = require("passport");


const utils = require("../utils/utils")


router.post('/auth/twitter/reverse', users.reverse);

router.post('/auth/twitter',
    users.twitter,
    passport.authenticate('twitter-token', { session: false }),
    users.prepareTokenWithuserID,
    utils.generateToken,
    utils.sendToken
);

// get all user
router.get('/auth/me', authenticate, utils.getCurrentUser, utils.getOne);

module.exports = router;