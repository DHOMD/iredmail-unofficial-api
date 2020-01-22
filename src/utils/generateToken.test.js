const chai = require('chai');
const should = chai.should();
const { generateRefreshToken, isTokenValid, getTokenValues, generateAccessToken } = require('./generateToken');

let refreshToken;
let accessToken;

describe('testing refreshToken functionality', () => {
	let tokenType = 'refreshToken';
	let username = 'info@nettifixi.fi';
	it('should generate refreshToken', done => {
		refreshToken = generateRefreshToken(username);
		should.exist(refreshToken);
		refreshToken.should.be.a('string');
		refreshToken.should.not.be.empty;
		done();
	});

	it('token should be valid', done => {
		const isValid = isTokenValid(refreshToken, tokenType);
		isValid.should.be.a('boolean');
		isValid.should.eql(true);
		done();
	});

	it('token should store values', done => {
		const values = getTokenValues(refreshToken, tokenType);
		console.log(values);
		values.should.be.an('object');
		values.should.not.be.empty;
		values.should.have.property('payload');
		done();
	});
});

describe('testing accessToken functionality', () => {
	let tokenType = 'accessToken';
	it('should generate accessToken with refreshToken', done => {
		accessToken = generateAccessToken(refreshToken);
		accessToken.should.be.a('string');
		accessToken.should.not.be.empty;
		done();
	});

	it('token should be valid', done => {
		const isValid = isTokenValid(accessToken, tokenType);
		isValid.should.be.a('boolean');
		isValid.should.eql(true);
		done();
	});
});
