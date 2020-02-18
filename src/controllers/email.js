const { getUser, createEmail, updatePassword, removeEmail } = require('../services/email');
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
	const isAllowed = await isAllowedToModify(userInfo, email);

	if (isAllowed) {
		try {
			const hash = await hashPassword(password);

			await updatePassword(email, hash);

			return { message: 'Password has been successfully changed', status: 200 };
		} catch {
			return { message: 'Someting went wrong on our side, try again later or contact admin' };
		}
	}

	return { message: 'Not allowed to modify password of this email', status: 503 };
};

const createNewEmailAccount = async (userInfo, email, password) => {
	const isAllowed = await isAllowedToModify(userInfo, email);

	if (isAllowed) {
		try {
			const hash = await hashPassword(password);

			await createEmail(email, hash);

			return { message: 'Successfully created new email account', status: 200 };
		} catch {
			return { message: 'Something went wrong on our side, try again later or contact admin', status: 500 };
		}
	}

	return { message: 'Not allowed to create new email accounts on this domain', status: 503 };
};

const removeEmailAccount = async (userInfo, email) => {
	const isAllowed = await isAllowedToModify(userInfo, email);

	if (isAllowed) {
		try {
			await removeEmail(email);

			return { message: 'Successfully removed email account', status: 200 };
		} catch {
			return { message: 'Something went wrong on our side, try again later or contact admin', status: 500 };
		}
	}

	return { message: 'Not allowed to remove email accounts on this domain', status: 503 };
};

module.exports = { isAllowedToModify, changeEmailPassword, createNewEmailAccount, removeEmailAccount };
