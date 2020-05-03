const router = require("express").Router();
const twitter = require('../controllers/twitter.controller.js');
const authenticate = require("../../authenticate");
const passport = require("passport");


router.get('/getall', authenticate, twitter.getTweets);
router.post('/', authenticate, twitter.replyTweet);


module.exports = router;