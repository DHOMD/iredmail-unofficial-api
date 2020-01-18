const fs = require('fs');
const jwt = require('jsonwebtoken');
const privKey = fs.readFileSync('jwtRS256.key');
const pubKey = fs.readFileSync('jwt');

const verifyRefreshToken = token => {
	// jwt.verify(token, )
};

const generateAccessToken = refreshToken => {
	const payload = verifyRefreshToken(refreshToken);
};

const generateRefreshToken = (tokenOptions, payload, signOptions) => {
	// delete payload.json;
	// return jwt.sign({ algorithm: 'RS256', keyid: });
};

const refreshToken = () => {};

jwt.sign(
	{
		exp: Math.floor(Date.now() / 1000) + 60 * 30, // 30 mins
		user: rows[0].userName
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
	generateNewToken,
	refreshToken
};
