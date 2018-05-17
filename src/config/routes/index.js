'use strict';

const router = require('express').Router();
const Promise = require('bluebird');

const Book = require('../../models/book');
const resErr = require('../../utils/respond-error');

let localTemp = {};

router.param('isbn', (req, res, next, isbn) => {
	return new Promise((resolve, reject) => {
		Book
		.findOne({isbn: req.params.isbn})
		.exec((err, book) => {
			if(err) reject(err);
			else resolve(book);
		});
    })
    .then((book) => {
		if(!book) return resErr(res, 404, 'The requested book cannot be found.');
		localTemp.book = book;
		next();
    })
    .catch(next);
});

router.route('/')
.all((req, res, next) => res.status(200).json({message: 'Welcome to the bookstore!'}));

router.route('/books')
.get((req, res, next) => {
    return new Promise((resolve, reject) => {
		Book
		.find({})
		.sort({author: 1})
		.exec((err, books) => {
			if(err) reject(err);
			else resolve(books);
		});
    })
    .then(books => {
		if(!books) resErr(res, 404, 'The requested books cannot be found.');
		else res.status(200).json(books);
    })
    .catch(next);
})
.post((req, res, next) => {
    return new Promise((resolve, reject) => {
		new Book(req.body)
		.save((err, book) => {
			if(err) reject(err);
			resolve(book);
		});
    })
    .then(book => res.status(200).json(book))
    .catch(next);
})
// For development and testing only!
.delete((req, res, next) => {
    return new Promise((resolve, reject) => {
		Book.find({})
		.remove((err, books) => {
			if(err) reject(err);
			resolve(books);
		});
    })
    .then(books => res.status(200).json(books))
    .catch(next);
});

router.route('/books/:isbn')
.get((req, res, next) => res.status(200).json(localTemp.book))
.put((req, res, next) => {
	return new Promise((resolve, reject) => {
		localTemp.book
		.update(req.body, (err, book) => {
			if(err) reject(err);
			resolve(book);
		});
    })
    .then(book => res.status(200).json(book))
    .catch(next);
})
.delete((req, res, next) => {
	return new Promise((resolve, reject) => {
		localTemp.book
		.remove((err, book) => {
			if(err) reject(err);
			else resolve(book);
		});
    })
    .then(book => res.status(200).json(book))
    .catch(next);
});

module.exports = router;