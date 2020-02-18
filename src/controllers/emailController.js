const { getUser, createEmail, updatePassword } = require('../services/email');
const { hashPassword } = require('../utils/generatePassword');

const isAllowedToModify = async (userInfo, email) => {
	const domain = email.split('@')[1];
	const username = userInfo.payload.username;

	try {
		const rows = await getUser(domain, username);

		if (rows[0] == '' || (username != rows[0].userName && rows[0].isAdmin != 1)) {
			return false;
		}
		return true;
	} catch {
		return false;
	}
};

const changeEmailPassword = async (userInfo, email, password) => {
	let message;
	let status;

	try {
		const isAllowed = await isAllowedToModify(userInfo, email);

		if (isAllowed) {
			try {
				const hash = await hashPassword(password);

				await updatePassword(email, hash);

				message = 'Password has been successfully changed';
				status = 200;
			} catch (e) {
				message = 'Something went wrong on our side, try again later or contact admin';
				status = 500;
			}
		} else {
			message = 'Not allowed to modify password of the current email';
			status = 503;
		}
	} catch (e) {
		message = 'Something went wrong, try again later';
		status = 500;
	}
	return { message, status };
};

const createNewEmailAccount = async (userInfo, email, password) => {
	let status;
	let message;

	try {
		const isAllowed = await isAllowedToModify(userInfo, email);

		if (isAllowed) {
			try {
				const hash = await hashPassword(password);

				await createEmail(email, hash);

				message = 'Successfully created new email account';
				status = 200;
			} catch (e) {
				message = 'Something went wrong on our side, try again later or contact admin';
				status = 500;
			}
		} else {
			message = 'Not allowed to create new email accounts on this domain';
			status = 503;
		}
	} catch (e) {
		message = 'Something went wrong, try again later';
		status = 500;
	}
	return { message, status };
};

module.exports = { isAllowedToModify, changeEmailPassword, createNewEmailAccount };
