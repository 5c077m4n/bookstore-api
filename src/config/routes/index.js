'use strict';

const router = require('express').Router();
const Promise = require('bluebird');

const Book = require('../../models/book');
const resErr = require('../../utils/respond-error');

let localTemp = {};

router.param('isbn', (req, res, next, isbn) => {
	Book
	.findOne({isbn: req.params.isbn})
    .then(book => {
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
	Book
	.find({})
	.sort({author: 1})
    .then(books => {
		if(!books) resErr(res, 404, 'The requested books cannot be found.');
		else res.status(200).json(books);
    })
    .catch(next);
})
.post((req, res, next) => {
	new Book(req.body)
	.save()
    .then(book => {
		if(!book) resErr(res, 500, 'The requested book has not been created.');
		else res.status(200).json(book);
    })
    .catch(next);
})
// For development and testing only!
.delete((req, res, next) => {
	Book
	.find({})
	.remove()
    .then(books => res.status(200).json(books))
    .catch(next);
});

router.route('/books/:isbn')
.get((req, res, next) => res.status(200).json(localTemp.book))
.put((req, res, next) => {
	localTemp.book
	.update(req.body)
	.then(book => res.status(200).json(book))
    .catch(next);
})
.delete((req, res, next) => {
	localTemp.book
	.remove()
    .then(book => res.status(200).json(book))
    .catch(next);
});

module.exports = router;