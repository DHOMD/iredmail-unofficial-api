const chai = require('chai');
chai.should();
const { isAllowedToModify, changeEmailPassword, createNewEmailAccount } = require('./emailController');

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

describe('testing changeEmailPassword', () => {
	it('should update email password', done => {
		changeEmailPassword(userInfo, 'info@nettifixi.fi', 'salasana123')
			.then(res => {
				res.should.be.an('object');
				res.status.should.eql(200);
				res.message.should.eql('Password has been successfully changed');
				done();
			})
			.catch(done);
	});
});

describe('testing createNewEmailAccount', () => {
	it('should create new email', done => {
		createNewEmailAccount(userInfo, 'temporar@nettifixi.fi', 'salasana123')
			.then(res => {
				res.should.be.an('object');
				res.status.should.eql(200);
				res.message.should.eql('Successfully created new email account');
				done();
			})
			.catch(done);
	});
});
