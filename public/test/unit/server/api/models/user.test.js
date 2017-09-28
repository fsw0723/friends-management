const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

require('mongoose');
require('sinon-mongoose');

const User = require('../../../../../server/api/models/user');

describe('User', () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('#getFriends', () => {
        it('should return friends email addresses', (done) => {
            let mockUser = sandbox.mock(User);
            let response = {
                '_id': {
                    '$oid': '59c7c9ac6c97b201996a7c0d'
                },
                'email': 'test@example.com',
                'subscribe': [],
                'block': [],
                'friends': [
                    {
                        '_id': {
                            '$oid': '59c7c9b06c97b201996a7c0e'
                        },
                        'email': 'abc@gmail.com',
                        'subscribe': [],
                        'block': [],
                        'friends': [
                            {
                                '$oid': '59c7c9ac6c97b201996a7c0d'
                            }
                        ]
                    }, {
                        '_id': {
                            '$oid': '60c7c9b06c97b201996a7c0e'
                        },
                        'email': 'def@gmail.com',
                        'subscribe': [],
                        'block': [],
                        'friends': [
                            {
                                '$oid': '59c7c9ac6c97b201996a7c0d'
                            }
                        ]
                    }
                ]
            };
            mockUser
                .expects('findOne').withArgs({ email: 'test@example.com' })
                .chain('populate', 'friends')
                .chain('exec')
                .yields(null, response);

            User.getFriends('test@example.com', (err, result) => {
                if (err) {
                    throw err;
                }
                mockUser.verify();
                mockUser.restore();
                expect(result).to.eql(['abc@gmail.com', 'def@gmail.com']);
                done();
            });
        });

        it('should return error information when error', (done) => {
            let mockUser = sandbox.mock(User);
            let errorResponse = 'error';
            mockUser
                .expects('findOne').withArgs({ email: 'test@example.com' })
                .chain('populate', 'friends')
                .chain('exec')
                .yields(errorResponse, null);

            User.getFriends('test@example.com', (err, result) => {
                mockUser.verify();
                mockUser.restore();
                expect(err).to.eql('error');
                done();
            });
        });

        it('should return user not exists error when cannot find user', (done) => {
            let mockUser = sandbox.mock(User);
            mockUser
                .expects('findOne').withArgs({ email: 'test@example.com' })
                .chain('populate', 'friends')
                .chain('exec')
                .yields(null, null);

            User.getFriends('test@example.com', (err, result) => {
                mockUser.verify();
                mockUser.restore();
                expect(err.message).to.deep.equal('Cannot find user');
                done();
            });
        });
    });
});
