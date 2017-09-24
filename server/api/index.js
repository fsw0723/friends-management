'use strict';

const Joi = require('joi');
const Boom = require('boom');
const routes = [
    {
        method: 'GET',
        path: '/hello',
        handler: require('./friendsHandler'),
        config: {
            tags: ['api']
        }
    }
];

module.exports = routes;
