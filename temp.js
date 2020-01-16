const connection = require('./config/database').promise();

// const { exec } = require('child_process');

// const hashPassword = password => {
// 	return new Promise((resolve, reject) => {
// 		exec(`doveadm pw -s 'ssha512' -p ${password}`, (err, stdout, stderr) => {
// 			if (!err && !stderr) {
// 				resolve(stdout);
// 			}
// 			reject('Failed to create new hash');
// 		});
// 	});
// };
// hashPassword('1123').then(pass => console.log(pass));

const getRes = async () => {
	const [rows] = await connection.execute('SELECT 1');
	console.log(rows);
};

getRes();
