'use strict';

const Joi = require('joi');

const routes = [
    {
        method: 'POST',
        path: '/user',
        config: {
            handler: require('./usersHandler').create,
            tags: ['api'],
            validate: {
                payload: {
                    email: Joi.string().required()
                }
            }
        }
    }, {
        method: 'POST',
        path: '/friends',
        config: {
            handler: require('./friendsHandler').create,
            tags: ['api'],
            validate: {
                payload: {
                    friends: Joi.array().length(2)
                }
            }
        }
    }, {
        method: 'GET',
        path: '/friends',
        config: {
            handler: require('./friendsHandler').get,
            tags: ['api'],
            validate: {
                query: {
                    email: Joi.string().required()
                }
            }
        }
    }
];

module.exports = routes;
