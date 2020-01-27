const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const should = chai.should();
const getTokenValues = require('../src/utils/verifyToken');

chai.use(chaiHttp);

let token;

describe('/GET auth', () => {
	it('it should GET a 200 request status and ask for authorization', done => {
		chai.request(server)
			.get('/auth')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.eql('Send a post request to this page for authorization');
				done();
			});
	});
});

describe('/POST auth', () => {
	it('it should return refreshToken and accessToken', done => {
		let obj = {
			userName: 'info@nettifixi.fi',
			password: 'salasana'
		};
		chai.request(server)
			.post('/auth')
			.send(obj)
			.end((err, res) => {
				res.should.have.status(200);
				should.exist(res.body);

				res.body.should.have.property('refreshToken');
				res.body.refreshToken.should.be.a('string');
				res.body.refreshToken.should.not.be.empty;

				res.body.should.have.property('accessToken');
				res.body.accessToken.should.be.a('string');
				res.body.accessToken.should.not.be.empty;
				done();
			});
	});
});
