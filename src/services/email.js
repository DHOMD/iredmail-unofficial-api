const { UserDomain, User, Domain } = require('../models/controlPanel');
const { Mailbox, Forwarding } = require('../models/vmail');
const { fn } = require('sequelize');

const getUser = (domain, username) => {
	return UserDomain.findAll({
		include: [
			{ model: User, where: { userName: username }, required: true },
			{ model: Domain, where: { domain }, required: true }
		]
	});
};

const updatePassword = (email, hash) => {
	return Mailbox.update({ password: hash }, { where: { username: email } });
};

const createEmail = (email, hash) => {
	const username = email.split('@');
	const user = username[0];
	const domain = username[1];
	const date = fn('now');
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

	return Promise.all([createMailbox, createForwarding]);
};

module.exports = { getUser, createEmail, updatePassword };
