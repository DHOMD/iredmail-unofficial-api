const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: null,
	database: 'controlPanel'
});

module.exports = connection;
