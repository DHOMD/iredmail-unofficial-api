const fs = require('fs');
const jwt = require('jsonwebtoken');
const pubKey = fs.readFileSync('jwtRS256.key.pub');

const getTokenValues = token => {
	try {
		const verified = jwt.verify(token, pubKey, { algorithms: ['RS256'] });
		if (verified) {
			return verified;
		}
	} catch (e) {
    console.log('Failed to parse token ' + e);
		return false;
	}
};

module.exports = getTokenValues;
