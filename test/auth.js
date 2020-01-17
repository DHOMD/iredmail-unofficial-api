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
	it('it should authenticate', done => {
		let obj = {
			userName: 'info@nettifixi.fi',
			password: 'salasana'
		};
		chai.request(server)
			.post('/auth')
			.send(obj)
			.end((err, res) => {
				should.exist(res.body);
				res.should.have.status(200);
				res.body.should.have.property('token');
				res.body.token.should.be.a('string');
				res.body.token.should.not.be.empty;
				token = res.body.token;
				done();
			});
	});

	it('token should be valid', done => {
		getTokenValues(token).should.not.be.eql(false);
		getTokenValues(token).should.have.property('user');
		done();
	});
});
