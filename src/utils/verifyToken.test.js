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

	it('should not throw an error', done => {
		const token =
			'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI2MGRkYjhmLTQ0M2QtNGNiOC1iMWYzLWFjYjYwODNmNjFkMiJ9.eyJ1c2VybmFtZSI6ImluZm9AbmV0dGlmaXhpLmZpIiwidHlwZSI6ImFjY2Vzc1Rva2VuIiwiaWF0IjoxNTgxMDc3NzczLCJleHAiOjE1ODEwNzg2NzMsImF1ZCI6Im5ldHRpZml4aS5maSIsImlzcyI6ImFwaS5uZXR0aWZpeGkuZmkiLCJzdWIiOiJpbmZvIn0.kW4bxCUazBqCgOLRVmr5vXi0u_GEoYaMftoiS1pqfZcNvOV8rWBXbDttas8sXM9tArccRyOkpMX6vFy_Ii0yVsdy1Ofi-QI_hPZc7ym4JLAhmLv1ahuSXPiVJOx8nBG7M0Z4CpMowO2lLNCIOhIJ9mqOv9wrpphzU2F9RdjIb3NPqmuqayBscqoQyGE2XNhZC7SwjfCp-z2BvvggK7xU7JiCjucYidDpQxvfW4E4UZ3nTxI6pkzCZ3jkgTbPZhha3sALv_IZRJOY1VJWujjC1qZ77DoBT8VNJUyFAGjCi4PRa-3bXMG7DMm0NeWg3tHUzLHJkayvGOktZ83PB8JBc3Qcscs_ZThNFtt41s6uASD7cs3mrKcewEH6PlguKtkbzctP8KZAawO88N1JiUxc_SfYfX3YrYdLOYfFSjWEUi9TyD_lyuZZHTY6Z88ahnyPd3tU_dVOaDo3WSELOQS4XmpfWjV-Owqwh6N1H4hstPWcMeABRzTBE71Df9_x3p6pZYfs_7xqV05WbqG1FXMk2bE2XhapZitiiVp7QhxWXv7nD_Wb3fJRfZsCLmjjXvtw-dFq5SdawypTXBfMLDuww0Ka3FA_Ma9iKC0FnQW2r29GfMT2aKBbiTTK5_EGNeC7CnEVF4EG7WtKv1caAlkO-K_i7T8-4Ewb0Toyovj4Ak4';
		const values = getTokenValues(token, 'accessToken');
		done();
	});

	it('accessToken should store values', done => {
		const values = getTokenValues(accessToken, 'accessToken');
		should.exist(values);
		values.should.have.property('payload');
		values.payload.should.not.be.empty;
		done();
	});
});
