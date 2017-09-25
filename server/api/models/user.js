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

module.exports = mongoose.model('user', userSchema);
