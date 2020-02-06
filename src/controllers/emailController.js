require('dotenv').config();
const { fn } = require('sequelize');
const { UserDomain, User, Domain } = require('../models/controlPanel');
const { Mailbox, Forwarding } = require('../models/vmail');
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

const changeEmailPassword = async (userInfo, email, password) => {
	let userMessage = '';
	try {
		const isAllowed = await isAllowedToModify(userInfo, email);

		if (isAllowed) {
			try {
				const hash = await hashPassword(password);

				await Mailbox.update({ password: hash }, { where: { username: email } });

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

const createNewEmailAccount = async (userInfo, email, password) => {
	let userMessage = '';
	try {
		const isAllowed = await isAllowedToModify(userInfo, email);

		if (isAllowed) {
			try {
				const hash = await hashPassword(password);

				const username = email.split('@');
				const user = username[0];
				const domain = username[1];
				const date = moment().format('YYYY.MM.DD.HH.mm.ss');
				const maildir = `${domain}/${email.charAt(0)}/${email.charAt(1)}/${email.charAt(2)}/${user}-${date}/`;

				const createMailbox = Mailbox.create({
					username: email,
					password: hash,
					name: ' ',
					storagebasedirectory: '/var/vmail',
					storagenode: 'vmail1',
					maildir: maildir,
					quota: 0,
					domain: domain,
					active: 1,
					passwordlastchange: fn('now'),
					created: fn('now')
				});

				const createForwarding = Forwarding.create({
					address: email,
					forwarding: email,
					domain: domain,
					dest_domain: domain,
					is_forwarding: 1
				});

				await Promise.all([createMailbox, createForwarding]);

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

module.exports = { isAllowedToModify, hashPassword, changeEmailPassword, createNewEmailAccount };
