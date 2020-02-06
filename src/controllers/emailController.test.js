const chai = require('chai');
const should = chai.should();
const { isAllowedToModify } = require('./emailController');

const userInfo = {
	payload: {
		username: 'info@nettifixi.fi'
	}
};

describe('testing isAllowedToModify', () => {
	it('should be allowed to modify', done => {
		isAllowedToModify(userInfo, 'info@nettifixi.fi; DROP TABLE `domains`')
			.then(flag => {
				flag.should.be.a('boolean');
				flag.should.eql(true);
				done();
			})
			.catch(done);
	});
});
