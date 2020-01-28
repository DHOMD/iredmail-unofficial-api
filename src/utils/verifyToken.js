const fs = require('fs');
const jwt = require('jsonwebtoken');
const pubKey = fs.readFileSync('jwtRS256.key.pub');

const isTokenValid = (token, type) => {
	const verified = jwt.verify(token, pubKey, {
		issuer: 'api.nettifixi.fi',
		algorithms: ['RS256']
	});

	if (verified && verified.type === type) {
		return true;
	}
	return false;
};

const getTokenValues = (token, type) => {
	const isValid = isTokenValid(token, type);
	if (isValid) {
		return jwt.decode(token, { complete: true });
	}
	return null;
};

module.exports = { isTokenValid, getTokenValues };
