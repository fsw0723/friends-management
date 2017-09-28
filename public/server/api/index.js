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
    }, {
        method: 'POST',
        path: '/friends/common',
        config: {
            handler: require('./friendsHandler').getCommon,
            tags: ['api'],
            validate: {
                payload: {
                    friends: Joi.array().length(2)
                }
            }
        }
    }, {
        method: 'POST',
        path: '/subscribe',
        config: {
            handler: require('./subscribeHandler').subscribe,
            tags: ['api'],
            validate: {
                payload: {
                    requestor: Joi.string().required(),
                    target: Joi.string().required()
                }
            }
        }
    }, {
        method: 'POST',
        path: '/block',
        config: {
            handler: require('./subscribeHandler').block,
            tags: ['api'],
            validate: {
                payload: {
                    requestor: Joi.string().required(),
                    target: Joi.string().required()
                }
            }
        }
    }, {
        method: 'POST',
        path: '/subscribers',
        config: {
            handler: require('./subscribeHandler').getSubscribers,
            tags: ['api'],
            validate: {
                payload: {
                    sender: Joi.string().required(),
                    text: Joi.string().required()
                }
            }
        }
    }
];

module.exports = routes;
