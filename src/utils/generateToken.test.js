const chai = require('chai');
const should = chai.should();
const { generateRefreshToken, generateAccessToken } = require('./generateToken');

let refreshToken;
let accessToken;

describe('testing refreshToken functionality', () => {
	let username = 'info@nettifixi.fi';
	it('should generate refreshToken', done => {
		refreshToken = generateRefreshToken(username);
		should.exist(refreshToken);
		refreshToken.should.be.a('string');
		refreshToken.should.not.be.empty;
		done();
	});
});

describe('testing accessToken functionality', () => {
	it('should generate accessToken with refreshToken', done => {
		accessToken = generateAccessToken(refreshToken);
		accessToken.should.be.a('string');
		accessToken.should.not.be.empty;
		done();
	});
});
