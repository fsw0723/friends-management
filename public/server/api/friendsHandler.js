'use strict';

const User = require('./models/user');
const async = require('async');
const Boom = require('boom');

function blockUpdates (requestor, target) {
    return requestor.block.indexOf(target._id.toString()) > -1;
}
function isFriends (user1, user2) {
    return user1.friends.indexOf(user2._id.toString()) > -1;
}

function create (request, reply) {
    let queries = [];
    request.payload.friends.forEach((email) => {
        queries.push(function (cb) {
            User.findOne({email: email}).exec(function (err, docs) {
                if (err) {
                    throw cb(err);
                }
                if (!docs) {
                    return reply(Boom.badRequest('User does not exist.'));
                }
                cb(null, docs);
            });
        });
    });

    async.parallel(queries, function (err, docs) {
        // if any query fails
        if (err) {
            throw err;
        }

        let user1 = docs[0];
        let user2 = docs[1];

        if (!blockUpdates(user1, user2) && !blockUpdates(user2, user1)) {
            if (!isFriends(user1, user2)) {
                user1.friends.push(user2._id);
                user1.save();
            }

            if (!isFriends(user2, user1)) {
                user2.friends.push(user1._id);
                user2.save();
            }

            return reply({
                success: true
            });
        } else {
            return reply({
                success: false
            });
        }
    });
}

function get (request, reply) {
    User.getFriends(request.query.email, (err, friends) => {
        if (err) {
            return reply(Boom.badRequest(err));
        }

        return reply(friends);
    });
}

function getCommon (request, reply) {
    let queries = [];
    request.payload.friends.forEach((email) => {
        queries.push((cb) => {
            User.getFriends(email, (err, docs) => {
                cb(err, docs);
            });
        });
    });

    async.parallel(queries, (err, docs) => {
        if (err) {
            return reply(Boom.badRequest(err));
        }

        let common = docs[0].filter((user) => docs[1].includes(user));
        return reply({
            success: true,
            friends: common,
            count: common.length
        });
    });
}

module.exports = {
    create,
    get,
    getCommon
};
