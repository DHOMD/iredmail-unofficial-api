const { Mailbox } = require('./models/vmail');

Mailbox.sync()
	.then(() => console.log('Tables have been synced'))
	.catch(console.log);
