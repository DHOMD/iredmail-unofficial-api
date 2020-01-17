const connection = require('../src/config/database');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET auth', () => {
	it('it should GET a 200 request status', done => {
		chai.request(server)
			.get('/auth')
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});
});
