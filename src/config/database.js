const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'admin',
	password: 'salasana',
	database: 'controlPanel'
});

connection.connect(err => {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
