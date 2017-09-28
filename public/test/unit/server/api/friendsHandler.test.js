const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
const assert = chai.assert;
const async = require('async');

require('mongoose');
require('sinon-mongoose');

const friendsHandler = require('../../../../server/api/friendsHandler');
const User = require('../../../../server/api/models/user');

chai.use(sinonChai);

describe('friendsHandler', () => {
    let sandbox;
    let email = 'test@example.com';
    let reply;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        reply = sandbox.spy();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('#create', () => {
        let mockAsync;
        let userDoc1, userDoc2;
        let request;
        let saveFunc;

        beforeEach(() => {
            mockAsync = sandbox.stub(async, 'parallel');
            saveFunc = sandbox.spy();
            userDoc1 = {
                '_id': '123',
                'email': 'user1@gmail.com',
                'friends': [],
                'block': [],
                save: saveFunc
            };

            userDoc2 = {
                '_id': '456',
                'email': 'user2@gmail.com',
                'friends': [],
                'block': [],
                save: saveFunc
            };

            request = {
                payload: {
                    friends: ['user1@gmail.com.com', 'user2@gmail.com']
                }
            };
        });

        it('should add user to each other\'s friends list', () => {
            friendsHandler.create(request, reply);
            mockAsync.yield(null, [userDoc1, userDoc2]);

            /* eslint-disable no-unused-expressions */
            expect(async.parallel).to.have.been.called;
            assert(saveFunc.calledTwice);
            expect(reply).have.been.calledWith({
                success: true
            });
        });

        it('should not add duplicate friends', () => {
            userDoc1.friends = ['456'];
            userDoc2.friends = ['123'];

            friendsHandler.create(request, reply);
            async.parallel.yield(null, [userDoc1, userDoc2]);

            /* eslint-disable no-unused-expressions */
            expect(async.parallel).to.have.been.called;
            assert(saveFunc.notCalled);
            expect(reply).have.been.calledWith({
                success: true
            });
        });

        it('should not add blocked user as friends', () => {
            userDoc2.block = ['123'];

            friendsHandler.create(request, reply);
            async.parallel.yield(null, [userDoc1, userDoc2]);

            /* eslint-disable no-unused-expressions */
            expect(async.parallel).to.have.been.called;
            assert(saveFunc.notCalled);
            expect(reply).have.been.calledWith({
                success: false
            });
        });
    });

    describe('#get', () => {
        let request;
        let getFriendsStub;

        beforeEach(() => {
            request = {
                query: {
                    email
                }
            };
            getFriendsStub = sandbox.stub(User, 'getFriends');
        });

        it('should return user\'s friends list', () => {
            let friendsList = ['abc@gmail.com'];
            friendsHandler.get(request, reply);
            getFriendsStub.yield(null, friendsList);

            expect(User.getFriends).to.have.been.calledWith(email, sinon.match.func);
            expect(reply).to.have.been.calledWith(friendsList);
        });

        it('should return bad request error if cannot find current user information', () => {
            friendsHandler.get(request, reply);
            getFriendsStub.yield('error', null);

            expect(User.getFriends).to.have.been.calledWith(email, sinon.match.func);
            expect(reply).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });
    });

    describe('#getComon', () => {
        let request;
        let getFriendsStub;

        beforeEach(() => {
            getFriendsStub = sandbox.stub(User, 'getFriends');
            request = {
                payload: {
                    friends: ['user1@gmail.com', 'user2@gmail.com']
                }
            };
        });

        it('should return friends\' email in common', () => {
            let friendsList1 = ['aaa@gmail.com', 'bbb@gmail.com'];
            let friendsList2 = ['ccc@gmail.com', 'bbb@gmail.com'];

            friendsHandler.getCommon(request, reply);
            getFriendsStub.withArgs('user1@gmail.com').yield(null, friendsList1);
            getFriendsStub.withArgs('user2@gmail.com').yield(null, friendsList2);

            expect(User.getFriends).to.have.been.calledWith('user1@gmail.com', sinon.match.func);
            expect(reply).to.have.been.calledWith({
                count: 1,
                friends: ['bbb@gmail.com'],
                success: true
            });
        });

        it('should return bad request error if cannot find user information with given email address', () => {
            friendsHandler.getCommon(request, reply);
            getFriendsStub.yield('error', null);

            expect(User.getFriends).to.have.been.calledWith('user1@gmail.com', sinon.match.func);
            expect(User.getFriends).to.have.been.calledWith('user2@gmail.com', sinon.match.func);
            expect(reply).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });
    });
});
