const chai = require('chai');
chai.should();
const { hashPassword } = require('./generatePassword');

describe('testing hashPassword functionality', () => {
	it('should generate a ssha512 hash', done => {
		hashPassword('salasana123')
			.then(hash => {
				hash.should.be.a('string');
				console.log(hash);
				done();
			})
			.catch(done);
	});
});
