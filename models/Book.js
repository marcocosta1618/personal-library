const { Schema, model } = require('mongoose');

const BookSchema = new Schema({
    title: String,
    comments: [String]
});

const Book = new model('Book', BookSchema);

module.exports = Book;