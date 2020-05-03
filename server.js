const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const passport = require("passport");


const app = express();
var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


mongoose.set('useFindAndModify', false);
mongoose.connect("'mongodb://localhost:27017/twitter-demo'", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("Database Connected");
});


const UserModel = require('./app/models/user.model.js');
UserModel()

app.use(passport.initialize());
require('./passport')(passport);

app.use('/api/v1/auth', require("./app/routes/auth.route"));
app.use('/api/v1/twitter', require("./app/routes/twitter.route"));
app.listen(4000);
module.exports = app;

console.log('Server running at http://localhost:4000/');