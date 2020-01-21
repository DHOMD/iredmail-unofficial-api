const express = require('express');
const router = express.Router();
const fs = require('fs');
const connection = require('../config/database').promise();
const { generateRefreshToken } = require('../utils/generateToken');
const { doesPasswordMatchHash } = require('../controllers/authController');

router.get('/', (req, res) => {
	res.json('Send a post request to this page for authorization');
});

router.post('/', (request, response) => {
	const { userName, password } = request.body;

	if (typeof userName === 'undefined' || typeof password === 'undefined') {
		response.json('Invalid or missing values');
	}

	connection
		.execute('SELECT * FROM `users` WHERE `userName` = ?', [userName])
		.then(async rows => {
			if (rows[0] != '') {
				const row = rows[0][0];
				const isCorrectPassword = await doesPasswordMatchHash(password, row.password);
				if (isCorrectPassword) {
					const refreshToken = generateRefreshToken(row.userName);
					// call a function to generate accessToken with refreshToken

					response.json({ refreshToken });
				} else {
					response.json('Wrong password');
				}
			} else {
				response.json('User not found');
			}
		})
		.catch(e => response.json('Something went wrong try again later'));
	// if record is found, generate refreshToken for 1 week and generate AccessToken for 15 min
});

router.post('/refresh', (request, response) => {});

module.exports = router;
