const fs = require('fs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const privKey = fs.readFileSync('jwtRS256.key');
const pubKey = fs.readFileSync('jwtRS256.key.pub');

const isTokenValid = (token, type) => {
	try {
		const verified = jwt.verify(token, pubKey, {
			issuer: 'api.nettifixi.fi',
			algorithms: ['RS256']
		});

		if (verified && verified.type === type) {
			return true;
		}
		return false;
	} catch (e) {
		console.log('Token could not be verified');
		return false;
	}
};

const getTokenValues = (token, type) => {
	const isValid = isTokenValid(token, type);
	if (isValid) {
		return jwt.decode(token, { complete: true });
	}
	return null;
};

const generateAccessToken = refreshToken => {
	const values = getTokenValues(refreshToken, 'refreshToken');

	if (values) {
		return jwt.sign({ username: values.payload.username, type: 'accessToken' }, privKey, {
			algorithm: 'RS256',
			keyid: uuid(),
			noTimestamp: false,
			expiresIn: '15m',
			issuer: values.payload.iss,
			audience: values.payload.aud,
			subject: values.payload.sub
		});
	}
	return null;
};

const generateRefreshToken = username => {
	const userArr = username.split('@');
	const token = jwt.sign({ username, type: 'refreshToken' }, privKey, {
		algorithm: 'RS256',
		keyid: uuid(),
		noTimestamp: false,
		expiresIn: '1w',
		issuer: 'api.nettifixi.fi',
		audience: userArr[1],
		subject: userArr[0]
	});

	// think about this https://softwareengineering.stackexchange.com/questions/373109/should-we-store-jwts-in-database

	return token;
};

const refreshToken = () => {};

module.exports = {
	generateRefreshToken,
	generateAccessToken,
	isTokenValid,
	getTokenValues
};
