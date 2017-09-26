'use strict';

const User = require('./models/user');
const Boom = require('boom');
const Log = require('log');

const log = new Log('info');

let create = function (request, reply) {
    let user = new User({
        email: request.payload.email
    });
    user.save().then((doc) => {
        log.info('New user saved', doc);
        reply({
            id: doc._id,
            email: doc.email
        });
    }).catch((err) => {
        log.error('Error when creating user: ', err);
        reply(Boom.badRequest(err.message));
    });
};

module.exports = {
    create
};
