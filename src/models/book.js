'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BookSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    isbn: {type: String, required: true, unique: true},
    author: {type: String, required: true},
    pubDate: {type: Date},
    genre: {
		type: String,
		enum: ['Science fiction', 'Satire', 'Drama', 'Action', 'Romance', 'Mystery', 'Horror']
	},
    price: {type: Number, required: true},
    quantity: {type: Number, default: 1}
});
BookSchema.method('update', function(updates) {
	Object.assign(this, updates);
	return this.save();
});

module.exports = mongoose.model('Book', BookSchema);