require('dotenv').config();
const connection = require('../config/database');
const { UserDomain, User, Domain } = require('../models/controlPanel');
const { exec } = require('child_process');
const moment = require('moment');

const isAllowedToModify = (userInfo, email) => {
	const domain = email.split('@')[1];

	return new Promise((resolve, reject) => {
		UserDomain.findAll({
			include: [
				{ model: User, where: { userName: userInfo.payload.username }, required: true },
				{ model: Domain, where: { domain }, required: true }
			]
		})
			.then(rows => {
				if (rows[0] == '' || (userInfo.payload.username != rows[0].userName && rows[0].isAdmin != 1)) {
					resolve(false);
				}
				resolve(true);
			})
			.catch(reject);
	});
};

const hashPassword = password => {
	// TODO: sanitize input from semicolons + escape html entities
	return new Promise((resolve, reject) => {
		exec(`doveadm pw -s 'ssha512' -p ${password}`, (err, stdout, stderr) => {
			if (!err && !stderr) {
				resolve(stdout);
			}
			reject('Failed to create new hash' + err);
		});
	});
};

exports.changeEmailPassword = async (userInfo, email, password) => {
	let userMessage = '';
	try {
		const isAllowed = await isAllowedToModify(userInfo, email);

		if (isAllowed) {
			try {
				const hash = await hashPassword(password);

				const switchToVmailDB = new Promise((resolve, reject) => {
					connection.changeUser(
						{
							user: process.env.VMAILUSER,
							password: process.env.VMAILPASS,
							database: 'vmail'
						},
						err => {
							if (err) {
								reject('Failed to change the database' + err);
							}
							resolve();
						}
					);
				});

				const updatePassword = new Promise((resolve, reject) => {
					connection.execute(
						'UPDATE `mailbox` SET `password` = ? WHERE `username` = ?',
						[hash, email],
						err => {
							if (err) {
								reject('Failed to update the password' + err);
							}
							resolve();
						}
					);
				});

				const switchToDefaultDB = new Promise((resolve, reject) => {
					connection.changeUser(
						{
							database: process.env.DEFAULTDB,
							user: process.env.DEFAULTUSER,
							password: process.env.DEFAULTPASS
						},
						err => {
							if (err) {
								reject('Failed to change back to default database' + err);
							}
							resolve();
						}
					);
				});

				await Promise.all([switchToVmailDB, updatePassword, switchToDefaultDB]);
				userMessage = 'Password has been successfully changed';
			} catch (e) {
				userMessage = 'Something went wrong on our side, try again later or contact admin';
				console.log('Inside nested catch block ' + e);
			}
		} else {
			userMessage = 'Not allowed to modify password of the current email';
		}
	} catch (e) {
		console.log('Inside catch block ' + e);
		userMessage = 'Something went wrong, try again later';
	}
	return userMessage;
};

exports.createNewEmailAccount = async (userInfo, email, password) => {
	let userMessage = '';
	try {
		const isAllowed = await isAllowedToModify(userInfo, email);

		if (isAllowed) {
			try {
				const hash = await hashPassword(password);

				const switchToVmailDB = new Promise((resolve, reject) => {
					connection.changeUser(
						{
							user: process.env.VMAILUSER,
							password: process.env.VMAILPASS,
							database: 'vmail'
						},
						err => {
							if (err) {
								reject('Failed to change the database ' + err);
							}
							resolve();
						}
					);
				});

				const createMailbox = new Promise((resolve, reject) => {
					const username = email.split('@');
					const user = username[0];
					const domain = username[1];
					const date = moment().format('YYYY.MM.DD.HH.mm.ss');
					const maildir = `${domain}/${email.charAt(0)}/${email.charAt(1)}/${email.charAt(
						2
					)}/${user}-${date}/`;

					connection.execute(
						'INSERT INTO `mailbox` (username, password, name, storagebasedirectory, storagenode, maildir, quota, domain, active, passwordlastchange, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
						[email, hash, '', '/var/vmail', 'vmail1', maildir, 0, domain, 1],
						(err, res, fields) => {
							if (err) {
								reject('Failed to create new user ' + err);
							}
							resolve();
						}
					);
				});

				const createForwardings = new Promise((resolve, reject) => {
					const username = email.split('@');
					const domain = username[1];
					connection.execute(
						'INSERT INTO `forwardings` (address, forwarding, domain, dest_domain, is_forwarding) VALUES (?, ?, ?, ?, 1)',
						[email, email, domain, domain],
						(err, res, fields) => {
							if (err) {
								reject('Failed to insert new user into forwardings ' + err);
							}
							resolve();
						}
					);
				});

				const switchToDefaultDB = new Promise((resolve, reject) => {
					connection.changeUser(
						{
							database: process.env.DEFAULTDB,
							user: process.env.DEFAULTUSER,
							password: process.env.DEFAULTPASS
						},
						err => {
							if (err) {
								reject('Failed to change back to default database ' + err);
							}
							resolve();
						}
					);
				});

				await Promise.all([switchToVmailDB, createMailbox, createForwardings, switchToDefaultDB]);
				userMessage = 'Successfully created new email account';
			} catch (e) {
				userMessage = 'Something went wrong on our side, try again later or contact admin';
				console.log('Inside nested catch block ' + e);
			}
		} else {
			userMessage = 'Not allowed to create new email accounts on this domain';
		}
	} catch (e) {
		console.log(e);
		userMessage = 'Something went wrong, try again later';
	}
	return userMessage;
};

module.exports = { isAllowedToModify };
