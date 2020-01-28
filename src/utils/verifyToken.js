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

module.exports = { isTokenValid };
