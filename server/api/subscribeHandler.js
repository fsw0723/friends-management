'use strict';

const User = require('./models/user');

function create (request, reply) {
    User.findOne({email: request.payload.target}).exec((err, doc) => {
        User.findOneAndUpdate(
            {email: request.payload.requestor},
            { $push: { subscribe: doc._id } },
            function(err, data) {
                // Handle err
                if(err) {
                    console.log(err);
                }
                return reply({
                    "success": true
                });
            }
        );
    });


}

module.exports = {
    create
};