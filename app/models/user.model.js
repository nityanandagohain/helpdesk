var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function() {
    var UserSchema = new Schema({
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        },
        username: {
            type: String
        },
        twitterProvider: {
            type: {
                id: String,
                token: String
            },
            select: false
        }
    });
    UserSchema.set('toJSON', { getters: true, virtuals: true });
    UserSchema.statics.addTwitterUser = function(token, tokenSecret, profile, cb) {
        var that = this;
        return this.findOne({
            'twitterProvider.id': profile.id
        }, function(err, user) {
            if (!user) {
                var newUser = new that({
                    email: profile.emails[0].value,
                    username: profile.username,
                    twitterProvider: {
                        id: profile.id,
                        token: token,
                        tokenSecret: tokenSecret
                    }
                });

                newUser.save(function(error, savedUser) {
                    if (error) {
                        console.log(error);
                    }
                    return cb(error, savedUser);
                });
            } else {
                return cb(err, user);
            }
        });
    };
    mongoose.model('User', UserSchema);
};