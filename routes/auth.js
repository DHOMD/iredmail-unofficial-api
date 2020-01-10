const express = require('express');
const router = express.Router();
const fs = require('fs');
const connection = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privKey = fs.readFileSync('jwtRS256.key');

router.get('/', (req, res) => {
	res.json('Send a post request to this page for authorization');
});

router.post('/', (request, response) => {
	const { userName, password } = request.body;

	if (typeof userName === 'undefined' || typeof password === 'undefined') {
		response.json('Invalid or missing values');
	}

	// protect from sql injections although possibly not needed if using prepared statements
	userName.replace(' ', '');
	userName.replace(';', '');

	connection.query(
		'SELECT * FROM `users` WHERE `userName` = ?',
		[userName],
		(err, res, fields) => {
			if (res.length) {
				bcrypt.compare(password, res[0].password, (err, result) => {
					if (result) {
						console.log('Authentication was successful');
						jwt.sign(
							{
								exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
								user: res[0].userName
								// isAdmin: res[0].isAdmin
							},
							privKey,
							{ algorithm: 'RS256' },
							(err, token) => {
								if (err) {
									response.json('Error occured when generating token');
								} else {
									response.json({ token });
								}
							}
						);
					} else {
						response.json('Incorrect Password');
					}
				});
			} else {
				response.json('No user found');
			}
		}
	);
});

module.exports = router;
