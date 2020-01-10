const express = require('express');
const router = express.Router();
const getTokenValues = require('../utils/verifyToken');
const { changeEmailPassword } = require('../controllers/emailController');

router.post('/reset', async (request, response) => {
	// get jwt from request
	const token = request.get('Authorization').replace('Bearer ', '');
	const { email, newPass } = request.body;
	const userInfo = getTokenValues(token);

	// const isAllowed = await isAllowedToModifyPassword(userInfo, email);
	const isAllowed = true;

	if (!userInfo) {
		response.json('Token is invalid or has expired');
	} else if (!isAllowed) {
		response.json("You don't have permissions to modify any other users beside yourself");
	} else if (typeof email === 'undefined' || typeof newPass === 'undefined') {
		response.json('Invalid values');
	} else if (newPass.length < 8 || !/\d/.test(newPass)) {
		response.json('Password must at least be 8 characters long and contain at least one digit');
	}

	// connection.changeUser({ user: process.env.VMAILUSER }, err => {});
});

module.exports = router;
