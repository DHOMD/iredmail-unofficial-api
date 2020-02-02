const chai = require('chai');
const should = chai.should();
const { generateRefreshToken, generateAccessToken } = require('./generateToken');
const { isTokenValid, getTokenValues } = require('./verifyToken');

const refreshToken = generateRefreshToken('info@nettifixi.fi');
const accessToken = generateAccessToken(refreshToken);

describe('testing validity of refreshToken with isTokenValid', () => {
	it('should be valid', done => {
		const flag = isTokenValid(refreshToken, 'refreshToken');
		flag.should.be.a('boolean');
		flag.should.eql(true);
		done();
	});
});

describe('testing validity of accessToken with isTokenValid', () => {
	it('should be valid', done => {
		const flag = isTokenValid(accessToken, 'accessToken');
		flag.should.be.a('boolean');
		flag.should.eql(true);
		done();
	});
});

describe('testing getTokenValues', () => {
	it('refreshToken should store values', done => {
		const values = getTokenValues(refreshToken, 'refreshToken');
		should.exist(values);
		values.should.have.property('payload');
		values.payload.should.not.be.empty;
		done();
	});

	it('accessToken should store values', done => {
		const values = getTokenValues(accessToken, 'accessToken');
		should.exist(values);
		values.hsould.have.property('payload');
		values.payload.should.not.be.empty;
	});
});
