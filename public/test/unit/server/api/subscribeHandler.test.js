const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

require('mongoose');
require('sinon-mongoose');

const subscribeHandler = require('../../../../server/api/subscribeHandler');
const User = require('../../../../server/api/models/user');

chai.use(sinonChai);

describe('friendsHandler', () => {
    let sandbox;
    let reply;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        reply = sandbox.spy();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('#subscribe', () => {
        it('should add target to sender\'s subscribe list', () => {
            let execSpy = sandbox.spy();
            sandbox.stub(User, 'findOne').returns({
                exec: execSpy
            });

            sandbox.stub(User, 'findOneAndUpdate');

            let request = {
                payload: {
                    requestor: 'user2@gmail.com',
                    target: 'user1@gmail.com'
                }
            };

            subscribeHandler.subscribe(request, reply);
            execSpy.yield(null, {
                _id: '123'
            });
            expect(User.findOne).to.have.been.calledWith({email: 'user1@gmail.com'});
            expect(User.findOneAndUpdate).to.have.been.calledWith({email: 'user2@gmail.com'}, {$addToSet: {subscribe: '123'}}, sinon.match.func);
        });
    });

    describe('#block', () => {
        it('should add target to sender\'s block list', () => {
            let execSpy = sandbox.spy();
            sandbox.stub(User, 'findOne').returns({
                exec: execSpy
            });

            sandbox.stub(User, 'findOneAndUpdate');

            let request = {
                payload: {
                    requestor: 'user2@gmail.com',
                    target: 'user1@gmail.com'
                }
            };

            subscribeHandler.block(request, reply);
            execSpy.yield(null, {
                _id: '123'
            });
            expect(User.findOne).to.have.been.calledWith({email: 'user1@gmail.com'});
            expect(User.findOneAndUpdate).to.have.been.calledWith({email: 'user2@gmail.com'}, {$addToSet: {block: '123'}}, sinon.match.func);
        });
    });

    describe('#getSubscribers', () => {
        it('should get all subscribers', () => {
            let request = {
                payload: {
                    sender: 'user1@gmail.com',
                    text: 'hello'
                }
            };
            let execSpy = sandbox.spy();
            sandbox.stub(User, 'findOne').returns({
                exec: execSpy
            });

            let callback;
            sandbox.stub(User, 'find').callsFake((args, cb) => {
                callback = cb;
            });

            subscribeHandler.getSubscribers(request, reply);
            execSpy.yield(null, {
                _id: '123'
            });
            expect(User.findOne).to.have.been.calledWith({email: 'user1@gmail.com'});
            expect(User.find).to.have.been.calledWith({$and: [{$or: [ {'friends': '123'}, {'subscribe': '123'} ]}, {'block': {$ne: '123'}}]}, sinon.match.func);
            callback(null, [{
                '_id': '456',
                'email': 'user2@gmail.com',
                'friends': ['123'],
                'block': []
            }]);
            expect(reply).to.have.been.calledWith({
                success: true,
                recipients: ['user2@gmail.com']
            });
        });

        it('should get all users mentioned in text as subscribers', () => {
            let request = {
                payload: {
                    sender: 'user1@gmail.com',
                    text: 'hello user3@gmail.com'
                }
            };
            let execSpy = sandbox.spy();
            sandbox.stub(User, 'findOne').returns({
                exec: execSpy
            });

            let callback;
            sandbox.stub(User, 'find').callsFake((args, cb) => {
                callback = cb;
            });

            subscribeHandler.getSubscribers(request, reply);
            execSpy.yield(null, {
                _id: '123'
            });
            expect(User.findOne).to.have.been.calledWith({email: 'user1@gmail.com'});
            expect(User.find).to.have.been.calledWith({$and: [{$or: [ {'friends': '123'}, {'subscribe': '123'} ]}, {'block': {$ne: '123'}}]}, sinon.match.func);
            callback(null, [{
                '_id': '456',
                'email': 'user2@gmail.com',
                'friends': ['123'],
                'block': []
            }]);
            expect(reply).to.have.been.calledWith({
                success: true,
                recipients: ['user2@gmail.com', 'user3@gmail.com']
            });
        });
    });
});
