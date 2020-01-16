const mysql = require('mysql2/promise');

const setup = async () => {
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'admin',
		password: 'salasana',
		database: 'controlPanel'
	});

	return connection;
};

module.exports = setup();
