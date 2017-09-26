'use strict';

const User = require('./models/user');

function subscribe (request, reply) {
    User.findOne({email: request.payload.target}).exec((err, doc) => {
        if (err) {
            throw (err);
        }
        User.findOneAndUpdate(
            {email: request.payload.requestor},
            {$addToSet: { subscribe: doc._id }},
            function (err, data) {
                // Handle err
                if (err) {
                    console.log(err);
                }
                return reply({
                    success: true
                });
            }
        );
    });
}

function block (request, reply) {
    User.findOne({email: request.payload.target}).exec((err, doc) => {
        if (err) {
            throw (err);
        }
        User.findOneAndUpdate(
            {email: request.payload.requestor},
            {$addToSet: {block: doc._id}},
            function (err, data) {
                // Handle err
                if (err) {
                    console.log(err);
                }
                return reply({
                    success: true
                });
            }
        );
    });
}

function extractEmails (text) {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

function subscriber (request, reply) {
    User.findOne({email: request.payload.sender}).exec((err, sender) => {
        if (err) {
            throw err;
        }
        User.find({$and: [{$or: [ {'friends': sender._id}, {'subscribe': sender._id} ]}, {'block': {$ne: sender._id}}]}, function (err, users) {
            if (!err) {
                let recipients = users.map((user) => {
                    return user.email;
                });

                recipients = recipients.concat(extractEmails(request.payload.text));
                return reply({
                    success: true,
                    recipients
                });
            }
        });
    });
}

module.exports = {
    subscribe,
    block,
    subscriber
};
