'use strict';

const Hapi = require('hapi');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: process.env.PORT || 3000
});

const options = {
    info: {
        title: 'Test API Documentation',
        version: '1.0'
    }
};

server.register([
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: options
    }], () => {
    server.start((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Server running at:', server.info.uri);
        }
    });
});

// Add the route
server.route(require('./server/api/index'));
