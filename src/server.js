const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
	res.json('Received a GET request');
});

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/email', require('./routes/email'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`> Server started on port ${port}`));

// export server for testing
module.exports = app;
