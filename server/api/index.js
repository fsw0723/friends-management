'use strict';

const routes = [
    {
        method: 'GET',
        path: '/hello',
        handler: function (request, reply) {
            return reply('hello world');
        }
    }
];

module.exports = routes;
