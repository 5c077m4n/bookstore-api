'use strict;'

const fs = require('fs');

const router = require('express').Router();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const Limiter = require('express-rate-limit');
const compress = require('compression');
const cors = require('cors');

/**
 * @function callback expects two parameters:
 * @param error - here null
 * @param options - whether of not the domain appears in the whitelist
 */
const corsOptionsDelegate = (req, callback) => {
	const whitelist = ['http://localhost:4200'];
	callback(
		null,
		{
			origin: (whitelist.indexOf(req.header('Origin')) !== -1),
			optionsSuccessStatus: 200
		}
	);
};
const dbURI = 'mongodb://social:qwerty_123@ds111319.mlab.com:11319/social';
// const dbURI = 'mongodb://0.0.0.0:27017/social';

mongoose.connect(dbURI)
	.then(() => {console.log(`You have been successfully connected to the database.`)})
	.catch(err => console.error(`connection error: ${err}`));
const db = mongoose.connection;
db.on('error', (err) => console.error(`connection error: ${err}`));

router.use((req, res, next) => {
	req.connection.setNoDelay(true);
	next();
});

router.use(compress({
	filter: (req, res) => {
		if (req.headers['x-no-compression']) return false;
		else return compress.filter(req, res);
	},
	level: -1
}));

router.use(bodyParser.json());
router.use(helmet());
router.options('*', cors(corsOptionsDelegate));
router.use(cors(corsOptionsDelegate));

router.use(new Limiter({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 200, // limit each IP to 200 requests per windowMs
	delayMs: 2 * 1000, // disable delaying - full speed until the max limit is reached
	delayAfter: 5
}));

router.use(express.static(__dirname + '/../public', {
	immutable: true,
	maxAge: 2 * 24 * 60 * 60 * 1000
}));

router.use('/', require('./routes'));

module.exports = router;
