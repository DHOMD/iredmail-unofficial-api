const fs = require('fs');
const bcrypt = require('bcrypt');
const privKey = fs.readFileSync('jwtRS256.key');

const doesPasswordMatchHash = async (password, hash) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, hash, (err, res) => {
			if (res) {
				resolve(true);
			}
			resolve(false);
		});
	});
};

module.exports = {
	doesPasswordMatchHash
};
