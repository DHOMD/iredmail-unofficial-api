const fs = require('fs');
const jwt = require('jsonwebtoken');
const pubKey = fs.readFileSync('jwtRS256.key.pub');

const isTokenValid = (token, type) => {
	let verified;
	try {
		verified = jwt.verify(token, pubKey, {
			issuer: 'api.nettifixi.fi',
			algorithms: ['RS256']
		});
	} catch (e) {
		return false;
	}

	if (verified && verified.type === type) {
		return true;
	}
	return false;
};

const getTokenValues = (token, type) => {
	const isValid = isTokenValid(token, type);
	let values;
	if (isValid) {
		try {
			values = jwt.decode(token, { complete: true });
		} catch (e) {
			values = null;
		}
	}
	return values || null;
};

module.exports = { isTokenValid, getTokenValues };
