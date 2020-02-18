const express = require('express');
const router = express.Router();
const { getTokenValues } = require('../utils/verifyToken');
const { changeEmailPassword, createNewEmailAccount, removeEmailAccount } = require('../controllers/email');
const { header, body, validationResult } = require('express-validator');

router.post(
	'/reset',
	[
		header('Authorization', 'Missing bearer token')
			.not()
			.isEmpty(),
		body('email').isEmail(),
		body('newPass', 'Password must be at least 8 characters long and contain at least one number')
			.not()
			.isEmpty()
			.trim()
			.blacklist('; ')
			.escape()
			.isLength({ min: 8 })
			.matches(/\d/)
	],
	async (request, response) => {
		const errors = validationResult(request).array();

		if (errors != '') {
			return response.status(400).json({ message: 'Invalid values', errors });
		}

		const token = request.get('Authorization').replace('Bearer ', '') || null;
		const { email, newPass } = request.body;

		const userInfo = getTokenValues(token, 'accessToken');

		if (!userInfo) {
			return response.status(400).json('Token is invalid or expired');
		}

		const { message, status } = await changeEmailPassword(userInfo, email, newPass);
		return response.status(status).json(message);
	}
);

router.post(
	'/add',
	[
		header('Authorization', 'Missing bearer token')
			.not()
			.isEmpty(),
		body('email').isEmail(),
		body('password', 'Password must be at least 8 characters long and contain at least one number')
			.not()
			.isEmpty()
			.trim()
			.blacklist('; ')
			.escape()
			.isLength({ min: 8 })
			.matches(/\d/)
	],
	async (request, response) => {
		const errors = validationResult(request).array();

		if (errors != '') {
			return response.status(400).json({ message: 'Invalid values', errors });
		}

		const token = request.get('Authorization').replace('Bearer ', '') || null;
		const { email, password } = request.body;

		const userInfo = getTokenValues(token, 'accessToken');

		if (!userInfo) {
			return response.status(400).json('Token is invalid or expired');
		}

		const { message, status } = await createNewEmailAccount(userInfo, email, password);
		return response.status(status).json(message);
	}
);

router.post(
	'/remove',
	[
		header('Authorization', 'Missing bearer token')
			.not()
			.isEmpty(),
		body('email').isEmail()
	],
	async (request, response) => {
		const errors = validationResult(request).array();

		if (errors != '') {
			return response.status(400).json({ message: 'Invalid values', errors });
		}

		const token = request.get('Authorization').replace('Bearer ', '') || null;
		const { email } = request.body;

		const userInfo = getTokenValues(token, 'accessToken');

		if (!userInfo) {
			return response.status(400).json('Token is invalid or expired');
		}

		const { message, status } = await removeEmailAccount(userInfo, email);
		return response.status(status).json(message);
	}
);

module.exports = router;
