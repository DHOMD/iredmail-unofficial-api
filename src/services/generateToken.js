const fs = require('fs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const privKey = fs.readFileSync('jwtRS256.key');
const { getTokenValues } = require('./verifyToken');

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
	generateAccessToken
};
