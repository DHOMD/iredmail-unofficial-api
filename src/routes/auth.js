const express = require('express');
const router = express.Router();
const { authenticate, refresh } = require('../controllers/authController');

router.get('/', (req, res) => {
	res.json('Send a post request to this page for authorization');
});

router.post('/', (request, response) => {
	const { userName, password } = request.body;

	if (typeof userName === 'undefined' || typeof password === 'undefined') {
		response.json('Invalid or missing values');
		return;
	}

	authenticate(userName, password)
		.then(obj => {
			const { status, message, refreshToken, accessToken } = obj;
			response.status(status).json({ message, refreshToken, accessToken });
		})
		.catch(() => {
			response
				.status(503)
				.json({ message: 'Something went wrong, try again later', refreshToken: '', accessToken: '' });
		});
});

router.post('/refresh', (request, response) => {
	const { refreshToken } = request.body;

	if (typeof refreshToken === 'undefined') {
		response.json('Invalid or missing values');
	}

	const { status, message, accessToken } = refresh(refreshToken);

	response.status(status);
	response.json({ message, accessToken });
});

module.exports = router;
