require('dotenv').config();
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
		} else {
			throw new Error('Failed to create new hash');
		}
	});
	return hash;
};

exports.changeEmailPassword = async (userInfo, email, password) => {
	try {
		const isAllowed = await isAllowedToModifyPassword(userInfo, email);
		if (isAllowed) {
			const newPass = hashPassword(password);

			connection.changeUser(
				{ user: process.env.VMAILUSER, password: process.env.VMAILPASS, database: 'vmail' },
				err => {
					if (err) {
						// throw new Error('Failed to change the database');
						console.log('Failed to change the database');
					}

					connection.query(
						'UPDATE `mailbox` SET `password` = ? WHERE username = ?',
						[newPass, email],
						(err, res, fields) => {
							if (err) throw new Error('Failed to update the password', err);
						}
					);

					connection.changeUser({ database: 'controlPanel' }, err => {
						if (err) throw new Error('Failed to change back to default database', err);
					});
				}
			);
		}
	} catch (e) {
		console.log(e);
	}
};
