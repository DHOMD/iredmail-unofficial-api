const express = require('express');
const router = express.Router();
const { authenticate, refresh } = require('../controllers/auth');
const { body, validationResult } = require('express-validator');

router.post(
	'/',
	[
		body('userName', 'Invalid or missing userName').isEmail(),
		body('password', 'Invalid or missing password')
			.not()
			.isEmpty()
			.trim()
			.blacklist('; ')
			.escape()
	],
	async (request, response) => {
		const errors = validationResult(request).array();

		if (errors != '') {
			return response.status(400).json({ message: 'Invalid values', errors });
		}

		const { userName, password } = request.body;

		const { status, message, refreshToken, accessToken } = await authenticate(userName, password);
		return response.status(status).json({ message, refreshToken, accessToken });
	}
);

router.post(
	'/refresh',
	[
		body('refreshToken', 'Invalid or missing refreshToken')
			.not()
			.isEmpty()
	],
	(request, response) => {
		const errors = validationResult(request).array();

		if (errors != '') {
			return response.status(400).json({ message: 'Invalid values', errors });
		}

		const { refreshToken } = request.body;
		const { status, message, accessToken } = refresh(refreshToken);

		return response.status(status).json({ message, accessToken });
	}
);

module.exports = router;
