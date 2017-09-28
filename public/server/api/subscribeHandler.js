'use strict';

const User = require('./models/user');
const async = require('async');
const Boom = require('boom');
const Log = require('log');

const log = new Log('info');

function subscribe (request, reply) {
    User.findOne({email: request.payload.target}).exec((err, doc) => {
        if (err) {
            log.error(err);
            return reply(Boom.badImplementation());
        }
        if (!doc) {
            return reply(Boom.badRequest('Cannot find user'));
        }
        User.findOneAndUpdate(
            {email: request.payload.requestor},
            {$addToSet: { subscribe: doc._id }},
            function (err, data) {
                if (err) {
                    return reply(Boom.badImplementation());
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
            log.error(err);
            return reply(Boom.badImplementation());
        }
        if (!doc) {
            return reply(Boom.badRequest('Cannot find user'));
        }
        User.findOneAndUpdate(
            {email: request.payload.requestor},
            {$addToSet: {block: doc._id}},
            function (err, data) {
                if (err) {
                    return reply(Boom.badImplementation());
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

function getSubscribers (request, reply) {
    User.findOne({email: request.payload.sender}).exec((err, sender) => {
        if (err) {
            log.error(err);
            return reply(Boom.badImplementation());
        }
        if (!sender) {
            return reply(Boom.badRequest('Cannot find user'));
        }
        User.find({$and: [{$or: [ {'friends': sender._id}, {'subscribe': sender._id} ]}, {'block': {$ne: sender._id}}]}, function (err, users) {
            if (!err) {
                let recipients = users.map((user) => {
                    return user.email;
                });

                let extractedEmail = extractEmails(request.payload.text);
                if (extractedEmail) {
                    extractedEmail = extractedEmail.filter((email) => {
                        return recipients.indexOf(email) === -1;
                    });
                    async.each(extractedEmail, function (email, callback) {
                        User.findOne({email}).exec((err, user) => {
                            if (err) {
                                callback(err);
                            }
                            if (!user || user.block.indexOf(sender._id) === -1) {
                                recipients.push(email);
                                callback();
                            } else {
                                callback();
                            }
                        });
                    }, function (err) {
                        if (err) {
                            return reply(Boom.badImplementation());
                        } else {
                            return reply({
                                success: true,
                                recipients
                            });
                        }
                    });
                } else {
                    return reply({
                        success: true,
                        recipients
                    });
                }
            } else {
                return reply(Boom.badImplementation());
            }
        });
    });
}

module.exports = {
    subscribe,
    block,
    getSubscribers
};
