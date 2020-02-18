const chai = require('chai');
const should = chai.should();
const { doesPasswordMatchHash, authenticate, findUser } = require('./auth');

let testObj = {
	userName: 'info@nettifixi.fi',
	password: 'salasana',
	hash: '$2b$10$Vd/Fu65koXxTNM4dOuxW5uy242qbqY3u7ygAm12D1yTNeFvmBaUrW'
};

describe('testing doesPasswordMatchHash', () => {
	it('should return true', done => {
		doesPasswordMatchHash(testObj.password, testObj.hash)
			.then(doesMatch => {
				doesMatch.should.be.a('boolean');
				doesMatch.should.eql(true);
				done();
			})
			.catch(done);
	});
});

describe('testing authenticate method', () => {
	it('should log to console', done => {
		authenticate(testObj.userName, testObj.password)
			.then(obj => {
				done();
			})
			.catch(done);
	});
});
