const router = require("express").Router();
const auth = require('../controllers/auth.controller.js');
const authenticate = require("../../authenticate");
const passport = require("passport");


const utils = require("../utils/utils")


router.post('/twitter/reverse', auth.reverse);

router.post('/twitter',
    auth.twitterAuth,
    passport.authenticate('twitter-token', { session: false }),
    auth.prepareTokenWithuserID,
    utils.generateToken,
    utils.sendToken
);

// get all user
router.get('/me', authenticate, utils.getCurrentUser, utils.getOne);

module.exports = router;