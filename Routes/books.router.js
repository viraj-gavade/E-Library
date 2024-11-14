const express = require('express')
const Book = require('../Models/book.models')
const 
{
    GetAllBooks,
    GetSingleBook,
    UpdateBook,
    UploadBook,
    DeleteBook,
    updatecoverImage,
    updatepdfLink,
    Toggleavaialablestatus,
    searchBook,
    DownloadBook
} = require('../Controllers/book.controllers')

const upload = require('../Middlewares/multer.middleware')
const verifyJwt = require('../Middlewares/auth.middleware')
const { findById } = require('../Models/book.models')

const BookRouter = express.Router()



//Main Routes

BookRouter.route('/books').get(GetAllBooks)
BookRouter.route('/books/search').get(searchBook)

BookRouter.route('/books/edit-book/:bookId').get(verifyJwt, async (req, res) => {
    const { bookId } = req.params;
  
    try {
      const book = await Book.findById(bookId); 
      if (!book) {
        return res.status(404).send("Book not found");
      }
      res.render('editbook', {
        user: req.user,
        book: book
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });
  



BookRouter.route('/books/:bookId').get(GetSingleBook)

BookRouter.route('/books/:bookId').patch(verifyJwt,UpdateBook)

BookRouter.route('/books/:bookId').delete(verifyJwt,DeleteBook)

BookRouter.route('/books/coverImage/:bookId').post(verifyJwt,
    upload.single('CoverImage'),updatecoverImage)


BookRouter.route('/books/pdfLink/:bookId').patch(verifyJwt,upload.single('pdfLink'),updatepdfLink)


BookRouter.route('/books').post(verifyJwt,
    upload.fields([
        {
            name:'pdfLink',
            maxCount:1
        },
        {
            name:'CoverImage',
            maxCount:1
        }
    ]),UploadBook

) ///Middleware to upload book with the help of cloudinary

BookRouter.route('/books/download/:bookId').get(verifyJwt,DownloadBook)


//Exporting the book router


module.exports = BookRouter