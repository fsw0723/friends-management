'use strict';

const Joi = require('joi');

const routes = [
    {
        method: 'POST',
        path: '/user',
        config: {
            handler: require('./usersHandler').create,
            tags: ['api'],
            notes: 'Create a new user',
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
            notes: 'Create a friend connection between two email addresses',
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
            notes: 'Retrieve the friends list for an email address',
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
            notes: 'Retrieve the common friends list between two email addresses',
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
            notes: 'Subscribe to updates from an email address',
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
            notes: 'Block updates from an email address',
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
            notes: 'Retrieve all email addresses that can receive updates from an email address',
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
