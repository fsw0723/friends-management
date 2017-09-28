'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    email: String,
    friends: [this],
    block: [this],
    subscribe: [this]
});

userSchema.index({email: 1}, {unique: true});

userSchema.statics.getFriends = function (email, cb) {
    this.findOne({email: email})
        .populate('friends')
        .exec(function (err, user) {
            if (err) {
                return cb(err);
            }

            if (!user) {
                return cb(new Error('Cannot find user'));
            }

            return cb(null, user.friends.map((friend) => {
                return friend.email;
            }));
        });
};

module.exports = mongoose.model('user', userSchema);
