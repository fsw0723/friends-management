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
    }
];

module.exports = routes;
