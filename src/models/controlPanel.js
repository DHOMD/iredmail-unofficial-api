const { DataTypes } = require('sequelize');
const sequelize = require('../config/controlPanel.js');

const User = sequelize.define(
	'users',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		userName: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.STRING
		}
	},
	{ timestamps: false }
);

const Domain = sequelize.define(
	'domains',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		domain: {
			type: DataTypes.STRING
		}
	},
	{ timestamps: false }
);

const UserDomain = sequelize.define(
	'users_domains',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		userId: {
			type: DataTypes.INTEGER,
			references: {
				model: User,
				key: 'id'
			}
		},
		domainId: {
			type: DataTypes.INTEGER,
			references: {
				model: Domain,
				key: 'id'
			}
		},
		isAdmin: {
			type: DataTypes.TINYINT,
			defaultValue: 0
		}
	},
	{ timestamps: false }
	// https://stackoverflow.com/questions/42195348/how-to-define-unique-index-on-multiple-columns-in-sequelize/42199137
	// Sequelize creates unique constraint on many-to-many relations
	// { uniqueKeys: actions_unique: { fields: ['userId', 'domainId'] } }
);

User.belongsToMany(Domain, { through: 'users_domains' });
Domain.belongsToMany(User, { through: 'users_domains' });

module.exports = { User, Domain, UserDomain };
