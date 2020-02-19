const bcrypt = require('bcrypt');
const { generateRefreshToken, generateAccessToken } = require('../utils/generateToken');
const { findUser } = require('../services/auth');

const doesPasswordMatchHash = (password, hash) => {
	return bcrypt.compare(password, hash);
};

const authenticate = async (userName, password) => {
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
			let refreshToken = generateRefreshToken(row.userName) || '';
			let accessToken = generateAccessToken(refreshToken) || '';

			return { status: 200, message: 'Succesfully authenticated', refreshToken, accessToken };
		}

		return { status: 400, message: 'Succesfully authenticated', refreshToken: '', accessToken: '' };
	} catch {
		return { status: 503, message: 'Something went wrong, try again later', refreshToken: '', accessToken: '' };
	}
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
	authenticate,
	refresh
};
