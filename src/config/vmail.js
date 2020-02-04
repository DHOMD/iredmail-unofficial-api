const Sequelize = require('sequelize');

module.exports = new Sequelize('vmail', process.env.VMAILUSER, process.env.VMAILPASS, {
	dialect: 'mysql'
});
