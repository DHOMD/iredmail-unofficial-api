const { DataTypes } = require('sequelize');
const sequelize = require('../config/vmail');

const Mailbox = sequelize.define(
	'mailbox',
	{
		username: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: ''
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		language: {
			type: DataTypes.STRING(5),
			allowNull: false,
			defaultValue: ''
		},
		mailboxformat: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: 'maildir'
		},
		mailboxfolder: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: 'Maildir'
		},
		storagebasedirectory: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '/var/vmail'
		},
		storagenode: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'vmail1'
		},
		maildir: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		quota: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			defaultValue: 0
		},
		domain: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		transport: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		department: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		rank: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'normal'
		},
		employeeid: {
			type: DataTypes.STRING,
			defaultValue: null
		},
		isadmin: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0
		},
		isglobaladmin: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0
		},
		enablesmtp: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablesmtpsecured: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablepop3: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablepop3secured: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablepop3tls: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enableimap: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enableimapsecured: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enableimaptls: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enabledeliver: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablelda: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablemanagesieve: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablemanagesievesecured: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablesieve: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablesievesecured: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablesievetls: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enableinternal: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enabledoveadm: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		'enablelib-storage': {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		'enableindexer-worker': {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablelmtp: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enabledsync: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		enablesogo: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		},
		allow_nets: {
			type: DataTypes.TEXT,
			defaultValue: null
		},
		lastlogindate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: '1970-01-01 01:01:01'
		},
		lastloginipv4: {
			type: DataTypes.INTEGER(4).UNSIGNED,
			allowNull: false,
			defaultValue: 0
		},
		lastloginprotocol: {
			type: DataTypes.CHAR(255),
			allowNull: false,
			defaultValue: ''
		},
		disclaimer: {
			type: DataTypes.TEXT,
			defaultValue: null
		},
		allowedsenders: {
			type: DataTypes.TEXT,
			defaultValue: null
		},
		rejectedsenders: {
			type: DataTypes.TEXT,
			defaultValue: null
		},
		allowedrecipients: {
			type: DataTypes.TEXT,
			defaultValue: null
		},
		rejectedrecipients: {
			type: DataTypes.TEXT,
			defaultValue: null
		},
		settings: {
			type: DataTypes.TEXT,
			defaultValue: null
		},
		passwordlastchange: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: '1970-01-01 01:01:01'
		},
		created: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: '1970-01-01 01:01:01'
		},
		modified: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: '1970-01-01 01:01:01'
		},
		expired: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: '9999-12-31 00:00:00'
		},
		active: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		}
	},
	{
		timestamps: false,
		freezeTableName: true,
		tableName: 'mailbox',
		indexes: [
			{ unique: false, fields: ['domain'] },
			{ unique: false, fields: ['department'] },
			{ unique: false, fields: ['employeeid'] },
			{ unique: false, fields: ['isadmin'] },
			{ unique: false, fields: ['isglobaladmin'] },
			{ unique: false, fields: ['enablesmtp'] },
			{ unique: false, fields: ['enablesmtpsecured'] },
			{ unique: false, fields: ['enablepop3'] },
			{ unique: false, fields: ['enablepop3secured'] },
			{ unique: false, fields: ['enablepop3tls'] },
			{ unique: false, fields: ['enableimap'] },
			{ unique: false, fields: ['enableimapsecured'] },
			{ unique: false, fields: ['enableimaptls'] },
			{ unique: false, fields: ['enabledeliver'] },
			{ unique: false, fields: ['enablelda'] },
			{ unique: false, fields: ['enablemanagesieve'] },
			{ unique: false, fields: ['enablemanagesievesecured'] },
			{ unique: false, fields: ['enablesieve'] },
			{ unique: false, fields: ['enablesievesecured'] },
			{ unique: false, fields: ['enablesievetls'] },
			{ unique: false, fields: ['enableinternal'] },
			{ unique: false, fields: ['enabledoveadm'] },
			{ unique: false, fields: ['enablelib-storage'] },
			{ unique: false, fields: ['enableindexer-worker'] },
			{ unique: false, fields: ['enablelmtp'] },
			{ unique: false, fields: ['enabledsync'] },
			{ unique: false, fields: ['enablesogo'] },
			{ unique: false, fields: ['passwordlastchange'] },
			{ unique: false, fields: ['expired'] },
			{ unique: false, fields: ['modified'] }
		]
	}
);

const Forwarding = sequelize.define(
	'forwardings',
	{
		id: {
			type: DataTypes.BIGINT(20).UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			defaultValue: null
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		forwarding: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		domain: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		dest_domain: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		is_maillist: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0
		},
		is_list: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0
		},
		is_forwarding: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0
		},
		is_alias: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0
		},
		active: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 1
		}
	},
	{
		timestamps: false,
		freezeTableName: true,
		tableName: 'forwardings',
		indexes: [
			{ unique: false, fields: ['address'] },
			{ unique: false, fields: ['domain'] },
			{ unique: false, fields: ['dest_domain'] },
			{ unique: false, fields: ['is_maillist'] },
			{ unique: false, fields: ['is_list'] },
			{ unique: false, fields: ['is_alias'] }
		]
	}
);

module.exports = { Mailbox, Forwarding };
