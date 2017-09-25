'use strict';

const User = require('./models/user');
const async = require('async');

function create (request, reply) {
    let queries = [];
    request.payload.friends.forEach((email) => {
        queries.push(function (cb) {
            User.findOne({ email: email}).exec(function (err, docs) {
                if (err) {
                    throw cb(err);
                }
                cb(null, docs);
            });
        });
    });

    async.parallel(queries, function(err, docs) {
        // if any query fails
        if (err) {
            throw err;
        }

        let user1 = docs[0];
        let user2 = docs[1];
        user1.friends.push(user2._id);
        user2.friends.push(user1._id);
        user1.save();
        user2.save();

        return reply({
            "success": true
        });
    });

}

function get(request, reply) {
    User.findOne({ email: request.query.email}).populate('friends').exec((err, docs) => {
        if (err) {
            console.log(err);
        }

        return reply(docs.friends.map((friend) => {
            return friend.email;
        }));
    });
}

module.exports = {
    create,
    get
};
