const express = require('express');
const router = express.Router();
const getTokenValues = require('../utils/verifyToken');
const { changeEmailPassword, createNewEmailAccount } = require('../controllers/emailController');

router.post('/reset', async (request, response) => {
	const token = request.get('Authorization').replace('Bearer ', '') || null;
	const { email, newPass } = request.body;
	const userInfo = getTokenValues(token);

	if (!userInfo) {
		response.json('Token is invalid or expired');
	} else if (typeof email === 'undefined' || typeof newPass === 'undefined') {
		response.json('Invalid values');
	} else if (newPass.length < 8 || !/\d/.test(newPass)) {
		response.json('Password must at least be 8 characters long and contain at least one digit');
	} else {
		const message = await changeEmailPassword(userInfo, email, newPass);
		response.json(message);
	}
});

router.post('/add', async (request, response) => {
	const token = request.get('Authorization').replace('Bearer ', '') || null;
	const { email, password } = request.body;
	const userInfo = getTokenValues(token);

	if (!userInfo) {
		response.json('Token is invalid or expired');
	} else if (typeof email === 'undefined' || typeof password === 'undefined') {
		response.json('Invalid values');
	} else if (password.length < 8 || !/\d/.test(password)) {
		response.json('Password must at least be 8 characters long and contain at least one digit');
	} else {
		const message = await createNewEmailAccount(userInfo, email, password);
		response.json(message);
	}
});

module.exports = router;
