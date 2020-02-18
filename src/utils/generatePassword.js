const { exec } = require('child_process');

const hashPassword = password => {
	return new Promise((resolve, reject) => {
		exec(`doveadm pw -s 'ssha512' -p ${password}`, (err, stdout, stderr) => {
			if (!err && !stderr) {
				resolve(stdout);
			}
			reject('Failed to create new hash' + err);
		});
	});
};

module.exports = { hashPassword };
