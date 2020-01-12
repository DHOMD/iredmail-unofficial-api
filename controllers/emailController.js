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
					reject(err.message);
				} else if (res.length && userInfo.user != res[0].userName && res[0].isAdmin != 1) {
					resolve(false);
				}
				resolve(res.length ? true : false);
			}
		);
	});
};

const hashPassword = password => {
	return new Promise((resolve, reject) => {
		exec(`doveadm pw -s 'ssha512' -p ${password}`, (err, stdout, stderr) => {
			if (!err && !stderr) {
				resolve(stdout);
			}
			reject('Failed to create new hash');
		});
	});
};

exports.changeEmailPassword = async (userInfo, email, password) => {
	let userMessages = [];
	try {
		const isAllowed = await isAllowedToModifyPassword(userInfo, email);
		if (isAllowed) {
			try {
				const newPass = await hashPassword(password);

				// rewrite all this not to use callbacks, instead to be used with promise.all()
				connection.changeUser(
					{
						user: process.env.VMAILUSER,
						password: process.env.VMAILPASS,
						database: 'vmail'
					},
					err => {
						if (err) {
							throw new Error('Failed to change the database');
						}

						connection.query(
							'UPDATE `mailbox` SET `password` = ? WHERE `username` = ?',
							[newPass, email],
							err => {
								if (err) throw new Error('Failed to update the password', err);
							}
						);

						connection.changeUser({ database: 'controlPanel' }, err => {
							if (err) {
								throw new Error('Failed to change back to default database', err);
							}
							console.info('Got this far!!!');
							userMessages.push('Password has been successfully changed');
							return userMessages;
						});
					}
				);
			} catch (e) {
				userMessages.push(
					'Something went wrong on our side, try again later or contact admin'
				);
				console.log(e.message);
			}
		} else {
			const err = new Error('Not allowed to modify password of the current email');
			userMessages.push(err.message);
			throw err;
		}
	} catch (e) {
		console.log(e.message);
		return userMessages;
	}
};
