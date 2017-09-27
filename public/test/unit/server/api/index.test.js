'use strict';

const Hapi = require('hapi');
const expect = require('chai').expect;

describe('Endpoint Routing', () => {
    let server;

    beforeEach((done) => {
        server = new Hapi.Server();
        server.connection();

        server.route(require('../../../../server/api/index'));
        done();
    });

    describe('#friends', function() {
        it('/friends should fail if pass less than 2 email addresses', (done) => {
            server.inject({
                method: 'POST',
                url: '/friends',
                payload: {
                    friends: ['abc@gmail.com']
                }
            }, function(res) {
                expect(res.statusCode).to.equal(400);
                let payload = JSON.parse(res.payload);
                expect(payload.message).to.include('"friends" must contain 2 items');
                done();
            });
        });

        it('/friends/common should fail if pass less than 2 email addresses', (done) => {
            server.inject({
                method: 'POST',
                url: '/friends/common',
                payload: {
                    friends: ['abc@gmail.com']
                }
            }, function(res) {
                expect(res.statusCode).to.equal(400);
                let payload = JSON.parse(res.payload);
                expect(payload.message).to.include('"friends" must contain 2 items');
                done();
            });
        });

        it('/get should fail if do not pass email', (done) => {
            server.inject({
                method: 'GET',
                url: '/friends'
            }, function(res) {
                expect(res.statusCode).to.equal(400);
                let payload = JSON.parse(res.payload);
                expect(payload.message).to.include('"email" is required');
                done();
            });
        });
    });

    describe('subsribe', () => {
        it('/subscribe should fail if do not pass requestor', (done) => {
            server.inject({
                method: 'POST',
                url: '/subscribe',
                payload: {}
            }, function(res) {
                expect(res.statusCode).to.equal(400);
                let payload = JSON.parse(res.payload);
                expect(payload.message).to.include('"requestor" is required');
                done();
            });
        });

        it('/subscribe should fail if do not pass target', (done) => {
            server.inject({
                method: 'POST',
                url: '/subscribe',
                payload: {
                    requestor: 'abc@gmail.com'
                }
            }, function(res) {
                expect(res.statusCode).to.equal(400);
                let payload = JSON.parse(res.payload);
                expect(payload.message).to.include('"target" is required');
                done();
            });
        });

        it('/block should fail if do not pass requestor', (done) => {
            server.inject({
                method: 'POST',
                url: '/block',
                payload: {}
            }, function(res) {
                expect(res.statusCode).to.equal(400);
                let payload = JSON.parse(res.payload);
                expect(payload.message).to.include('"requestor" is required');
                done();
            });
        });

        it('/block should fail if do not pass target', (done) => {
            server.inject({
                method: 'POST',
                url: '/block',
                payload: {
                    requestor: 'abc@gmail.com'
                }
            }, function(res) {
                expect(res.statusCode).to.equal(400);
                let payload = JSON.parse(res.payload);
                expect(payload.message).to.include('"target" is required');
                done();
            });
        });

        it('/subscribers should fail if do not pass sender', (done) => {
            server.inject({
                method: 'POST',
                url: '/subscribers',
                payload: {}
            }, function(res) {
                expect(res.statusCode).to.equal(400);
                let payload = JSON.parse(res.payload);
                expect(payload.message).to.include('"sender" is required');
                done();
            });
        });

        it('/subscribers should fail if do not pass text', (done) => {
            server.inject({
                method: 'POST',
                url: '/subscribers',
                payload: {
                    sender: 'abc@gmail.com'
                }
            }, function(res) {
                expect(res.statusCode).to.equal(400);
                let payload = JSON.parse(res.payload);
                expect(payload.message).to.include('"text" is required');
                done();
            });
        });

    });
});

