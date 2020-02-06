const chai = require('chai');
chai.should();
const { isAllowedToModify, hashPassword, changeEmailPassword, createNewEmailAccount } = require('./emailController');

const userInfo = {
	payload: {
		username: 'info@nettifixi.fi'
	}
};

describe('testing isAllowedToModify', () => {
	it('should be allowed to modify', done => {
		isAllowedToModify(userInfo, 'info@nettifixi.fi')
			.then(flag => {
				flag.should.be.a('boolean');
				flag.should.eql(true);
				done();
			})
			.catch(done);
	});
});

describe('testing hashPassword', () => {
	it('should generate a sha512 hash', done => {
		hashPassword('salasana1; touch file.txt')
			.then(hash => {
				hash.should.be.a('string');
				done();
			})
			.catch(done);
	});
});

describe('testing changeEmailPassword', () => {
	it('should update email password', done => {
		changeEmailPassword(userInfo, 'info@nettifixi.fi', 'salasana123')
			.then(res => {
				res.should.be.a('string');
				res.should.eql('Password has been successfully changed');
				done();
			})
			.catch(done);
	});
});

describe('testing createNewEmailAccount', () => {
	it('should create new email', done => {
		createNewEmailAccount(userInfo, 'temporary@nettifixi.fi', 'salasana123')
			.then(res => {
				res.should.be.a('string');
				res.should.eql('Successfully created new email account');
				done();
			})
			.catch(done);
	});
});
