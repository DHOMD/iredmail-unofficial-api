const bcrypt = require('bcrypt');
const { User } = require('../models/controlPanel');
const { generateRefreshToken, generateAccessToken } = require('../utils/generateToken');

const doesPasswordMatchHash = (password, hash) => {
	return bcrypt.compare(password, hash);
};

const findUser = userName => {
	return User.findAll({ where: { userName }, attributes: ['userName', 'password'] });
};

const authenticate = async (userName, password) => {
	let status;
	let message;
	let refreshToken = '';
	let accessToken = '';

	try {
		const rows = await findUser(userName);
		const row = rows[0];

		let isCorrectPassword;

		try {
			// bcrypt throws error if password doesn't match hash
			isCorrectPassword = await doesPasswordMatchHash(password, row.password);
		} catch (e) {
			isCorrectPassword = false;
		}

		if (isCorrectPassword) {
			refreshToken = generateRefreshToken(row.userName) || '';
			accessToken = generateAccessToken(refreshToken) || '';

			status = 200;
			message = 'Successfully authenticated';
		} else {
			status = 400;
			message = 'Wrong username or password';
		}
	} catch (e) {
		status = 503;
		message = 'Something went wrong, try again later';
	}

	return { status, message, refreshToken, accessToken };
};

const refresh = refreshToken => {
	const accessToken = generateAccessToken(refreshToken);
	if (accessToken) {
		return { status: 200, message: 'Successfully updated the token', accessToken };
	}
	return { status: 400, message: 'Invalid or expired token', accessToken: '' };
};

module.exports = {
	doesPasswordMatchHash,
	findUser,
	authenticate,
	refresh
};
