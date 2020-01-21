const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const should = chai.should();
const getTokenValues = require('../src/utils/verifyToken');
const { generateRefreshToken } = require('../src/utils/generateToken');
const { doesPasswordMatchHash } = require('../src/controllers/authController');

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
	it('it should return refreshToken', done => {
		let obj = {
			userName: 'info@nettifixi.fi',
			password: 'salasana'
		};
		chai.request(server)
			.post('/auth')
			.send(obj)
			.end((err, res) => {
				should.exist(res.body);
				res.body.should.have.property('refreshToken');
				res.body.refreshToken.should.be.a('string');
				res.body.refreshToken.should.not.be.empty;
				done();
			});
	});

	it('password must match hash in db', done => {
		const hash = '$2b$10$Vd/Fu65koXxTNM4dOuxW5uy242qbqY3u7ygAm12D1yTNeFvmBaUrW';
		const password = 'salasana';
		doesPasswordMatchHash(password, hash)
			.then(flag => {
				flag.should.be.a('boolean');
				flag.should.eql(true);
				done();
			})
			.catch(done);
	});

	it('it should generate token', done => {
		token = generateRefreshToken('info@nettifix.fi');
		token.should.be.a('string');
		token.should.not.be.empty;
		done();
	});

	it('token should be valid', done => {
		const values = getTokenValues(token);
		values.should.not.be.eql(false);
		values.should.have.property('username');
		values.should.not.be.empty;
		done();
	});
});
