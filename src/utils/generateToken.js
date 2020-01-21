const fs = require('fs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const privKey = fs.readFileSync('jwtRS256.key');
const pubKey = fs.readFileSync('jwtRS256.key.pub');

const verifyRefreshToken = (token, options) => {
	jwt.verify(token, pubKey, { audience: options.user, issuer: 'api.nettifixi.fi' });
};

const generateAccessToken = refreshToken => {
	const payload = verifyRefreshToken(refreshToken);
};

const generateRefreshToken = username => {
	const token = jwt.sign({ username, type: 'refreshToken' }, privKey, {
		algorithm: 'RS256',
		keyid: uuid(),
		noTimestamp: false,
		expiresIn: '1w'
	});

	// think about this https://softwareengineering.stackexchange.com/questions/373109/should-we-store-jwts-in-database

	return token;
};

const refreshToken = () => {};

jwt.sign(
	{
		exp: Math.floor(Date.now() / 1000) + 60 * 30 // 30 mins
		// user: rows[0].userName
	},
	privKey,
	{ algorithm: 'RS256' },
	(err, token) => {
		if (err) {
			response.json('Error occured when generating token');
		} else {
			response.json({ token });
		}
	}
);

module.exports = {
	refreshToken,
	generateRefreshToken
};
