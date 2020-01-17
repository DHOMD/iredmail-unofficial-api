const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'admin',
	password: 'salasana',
	database: 'controlPanel'
});

module.exports = connection;
