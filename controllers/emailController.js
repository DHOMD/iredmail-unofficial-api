const connection = require('../config/database');
const { exec } = require('child_process');

const isAllowedToModifyPassword = (userInfo, email) => {
	const domain = email.slice(email.indexOf('@')).replace('@', '');
	return new Promise((resolve, reject) => {
		connection.query(
			'SELECT `users`.`userName`, `domains`.`domain`, `users_domains`.`isAdmin` FROM `users_domains` LEFT JOIN `users` ON `users_domains`.`userId` = `users`.`id` LEFT JOIN `domains` ON `users_domains`.`domainId` = `domains`.`id` WHERE `users`.`userName` = ? AND `domains`.`domain` = ?',
			[userInfo.user, domain],
			(err, res, fields) => {
				if (err) {
					reject(err);
				} else if (res.length && userInfo.user != res[0].userName && res[0].isAdmin != 1) {
					resolve(false);
				}
				resolve(res.length ? true : false);
			}
		);
	});
};

const hashPassword = password => {
	const hash = exec(`doveadm pw -s 'ssha512' -p ${password}`, (err, stdout, stderr) => {
		if (!err) {
			return stdout;
		}
	});
	return hash;
};

exports.changeEmailPassword = async (userInfo, email, password) => {
	try {
		const isAllowed = await isAllowedToModifyPassword(userInfo, email);
		if (isAllowed) {
			// add error handling in case returned value is undefined
			const newPass = hashPassword(password);

			// change db to vmail and update the password
			connection.query(
				'UPDATE `users` SET `password` = ? WHERE `id` = 1',
				[newPass],
				(err, res, fields) => {}
			);
		}
	} catch (e) {
		console.log(e);
	}
};
