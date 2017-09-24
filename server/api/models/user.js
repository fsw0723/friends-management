'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let userSchema = new Schema({
    email: String,
    friends: [{ type: ObjectId, ref: 'User' }],
    block: [{ type: ObjectId, ref: 'User' }],
    subscribe: [{ type: ObjectId, ref: 'User' }]
});

userSchema.index({email: 1}, {unique: true});

module.exports = mongoose.model('user', userSchema);
