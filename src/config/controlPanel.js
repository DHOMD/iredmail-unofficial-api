const Sequelize = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize(process.env.DEFAULTDB, process.env.DEFAULTUSER, process.env.DEFAULTPASS, {
	dialect: 'mysql'
});
