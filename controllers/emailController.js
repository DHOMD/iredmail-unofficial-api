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
				} else if (res != '' && userInfo.user != res[0].userName && res[0].isAdmin != 1) {
					resolve(false);
				} else if (res != '') {
					resolve(true);
				}
				resolve(false);
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

				const switchToVmailDB = new Promise((resolve, reject) => {
					connection.changeUser(
						{
							user: process.env.VMAILUSER,
							password: process.env.VMAILPASS,
							database: 'vmail'
						},
						err => {
							if (err) {
								reject('Failed to change the database');
							}
							resolve();
						}
					);
				});

				const updatePassword = new Promise((resolve, reject) => {
					connection.query(
						'UPDATE `mailbox` SET `password` = ? WHERE `username` = ?',
						[newPass, email],
						err => {
							if (err) {
								reject('Failed to update the password');
							}
							resolve();
						}
					);
				});

				// todo move the credentials to env file
				const switchToDefaultDB = new Promise((resolve, reject) => {
					connection.changeUser(
						{ database: 'controlPanel', user: 'admin', password: 'salasana' },
						err => {
							if (err) {
								reject(err);
							}
							resolve();
						}
					);
				});

				await Promise.all([switchToVmailDB, updatePassword, switchToDefaultDB]);
			} catch (e) {
				userMessages.push(
					'Something went wrong on our side, try again later or contact admin'
				);
				console.log('Inside nested catch block ' + e);
			}
		} else {
			const err = new Error('Not allowed to modify password of the current email');
			userMessages.push(err.message);
			throw err;
		}
	} catch (e) {
		console.log('Inside catch block ' + e);
		return userMessages;
	}
};
