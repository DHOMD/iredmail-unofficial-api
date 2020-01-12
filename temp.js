// const connection = require('./config/database');

// connection.changeUser({ database: 'ishanovNet' }, err => {
// 	connection.query('SELECT `user_login` FROM `wp_users`', [], (err, res, fields) => {
// 		console.log(res);
// 	});

// 	connection.changeUser({ database: 'controlPanel' });

// 	connection.query('SELECT * FROM `users`', [], (err, res, fields) => {
// 		console.log(
// 			'Values in table users inside changeUser ishanov.net and after changeUser controlPanel: ',
// 			res
// 		);
// 	});
// });

// connection.changeUser({ database: 'controlPanel' }, err => {
// 	if (err) {
// 		console.log(err);
// 	}
// });

// connection.query('SELECT * FROM `users`', [], (err, res, fields) => {
// 	console.log('Values in table users after switch: ', res);
// });

// const hashPassword = password => {
// 	const hash = exec(`doveadm pw -s 'ssha512' -p ${password}`, (err, stdout, stderr) => {
// 		if (!err) {
// 			return stdout;
// 		}
// 	});
// 	return hash;
// };

// hashPassword('123123');

// try {
// 	let bar = 1;

// 	if (bar != 5) {
// 		throw new Error('Bar is not 5');
// 	}
// 	throw new Error('This should never get thrown');
// } catch (e) {
// 	console.error(e.message);
// }
const { exec } = require('child_process');

const hashPassword = password => {
	return new Promise((resolve, reject) => {
		exec(`doveadm pw -s 'ssha512' -p ${password}`, (err, stdout, stderr) => {
			if (!err && !stderr) {
				resolve(stdout);
			}
			reject('Failed to create new hash');
		});
	});
};
hashPassword('1123').then(pass => console.log(pass));
