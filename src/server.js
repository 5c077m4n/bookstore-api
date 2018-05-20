'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const app = express();
const HOST = '0.0.0.0', PORT = process.env.PORT || 3000;
const accessLogStream = fs.createWriteStream(
	path.join(__dirname, '../localData/logStream.log'),
	{flags: 'a'}
);

mongoose.set('debug', (collectionName, methodName) => {
	accessLogStream.write(`Mongoose: ${collectionName}.${methodName}() @ ${(new Date()).toLocaleString()}\n`);
	console.log(`Mongoose: ${collectionName}.${methodName}() @ ${(new Date()).toLocaleString()}`);
});

app.use(logger('common', {stream: accessLogStream}));
app.use(logger('common'));

app.use('/', require('./config/express'));

app.use((req, res, next) => {
	const err = new Error('The requested page cannot be found.');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	console.error(err);
	return res.status((err.status >= 100 && err.status < 600)? err.status : 500).json({
		error: {
			status: err.status,
			message: err.message
		}
	});
});

http
.createServer(app)
.listen(PORT, HOST, () => console.log(`Express is now running on http://${HOST}:${PORT}`))
.on('error', function(err) {
    console.error(`Connection error: ${err}`);
    this.close(() => {
        console.error(`The connection has been closed.`);
        process.exit(-2);
    });
});
