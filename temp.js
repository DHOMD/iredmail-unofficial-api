const connection = require('./config/database');
const { exec } = require('child_process');

connection.changeUser({ database: 'ishanovNet' }, err => {
	connection.query('SELECT `user_login` FROM `wp_users`', [], (err, res, fields) => {
		console.log(res);
	});

	connection.changeUser({ database: 'controlPanel' });

	connection.query('SELECT * FROM `users`', [], (err, res, fields) => {
		console.log(
			'Values in table users inside changeUser ishanov.net and after changeUser controlPanel: ',
			res
		);
	});
});

// connection.changeUser({ database: 'controlPanel' }, err => {
// 	if (err) {
// 		console.log(err);
// 	}
// });

// connection.query('SELECT * FROM `users`', [], (err, res, fields) => {
// 	console.log('Values in table users after switch: ', res);
// });

const hashPassword = password => {
	const hash = exec(`doveadm pw -s 'ssha512' -p ${password}`, (err, stdout, stderr) => {
		if (!err) {
			return stdout;
		}
	});
	return hash;
};

hashPassword('123123');
