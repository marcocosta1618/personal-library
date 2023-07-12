/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const Book = require('../models/Book');
const validId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = function (app) {

  // connect to Database
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

  app.route('/api/books')
    .get(async (req, res, next) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const library = await Book.find({});
        res.json(library.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        })));
      } catch(err) {
        return next(err);
      }
    })
    
    .post(async (req, res, next) => {
      //response will contain new book object including at least _id and title
      const { title } = req.body;
      if (!title) {
        res.send('missing required field title');
      } else {
        try {
          const newBook = new Book({ title });
          await newBook.save();
          res.json({
            _id: newBook._id,
            title: newBook.title
          })
        } catch (err) {
          return next(err);
        }
      }
    })
    
    .delete(async (req, res, next) => {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch(err) {
        return next(err);
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res, next) => {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const bookid = req.params.id;
      if (!validId(bookid)) {
        res.send('no book exists');
      } else {
        try {
          const book = await Book.findById(bookid);
          if (!book) {
            res.send('no book exists')
          } else {
            res.json({
              _id: book._id,
              title: book.title,
              comments: book.comments
            })
          }
        } catch(err) {
          return next(err);
        }
      }
    })
    
    .post(async (req, res, next) => {
      //json res format same as .get
      const bookid = req.params.id;
      if (!validId(bookid)) {
        res.send('no book exists');
      } else {
        const { comment } = req.body;
        if (!comment) {
          res.send('missing required field comment');
        } else {
          const book = await Book.findById(bookid);
          if (!book) {
            res.send('no book exists');
          } else {
            book.comments.push(comment);
            try {
              await book.save();
              res.json({
                _id: book._id,
                title: book.title,
                comments: book.comments
              });
            } catch (err) {
              return next(err);
            }
          }
        }
      }
    })
    
    .delete(async (req, res, next) => {
      //if successful response will be 'delete successful'
      let bookid = req.params.id;
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          res.send('no book exists');
        } else {
          await book.deleteOne();
          res.send('delete successful');
        }
      } catch(err) {
        return next(err);
      }
    });
}