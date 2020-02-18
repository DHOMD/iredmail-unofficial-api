const { User } = require('../models/controlPanel');

const findUser = userName => {
	return User.findAll({ where: { userName }, attributes: ['userName', 'password'] });
};

module.exports = { findUser };
