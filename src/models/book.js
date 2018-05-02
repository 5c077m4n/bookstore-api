'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BookSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    isbn: {type: String, required: true, unique: true},
    author: {type: String, required: true},
    pubDate: {type: Date, required: true},
    genre: {type: String, required: true, enum: ['Science fiction', 'Satire', 'Drama', 'Action', 'Romance', 'Mystery', 'Horror']},
    price: {type: Number, required: true},
    quantity: {type: Number, default: 1}
});
BookSchema.method('update', function(updates, callback) {
	Object.assign(this, updates);
	this.save(callback);
});

module.exports = mongoose.model('Book', BookSchema);