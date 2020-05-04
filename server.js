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
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/twitter-demo", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
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


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html')); //relative path
    })
}

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});