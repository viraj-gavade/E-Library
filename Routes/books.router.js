const express = require('express')
const Book = require('../Models/book.models')
const 
{
    UpdateBook,
    UploadBook,
    DeleteBook,
} = require('../Controllers/book.controllers')

const upload = require('../Middlewares/multer.middleware')
const verifyJwt = require('../Middlewares/auth.middleware')


const BookRouter = express.Router()



//Main Routes

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
  
BookRouter.route('/books/:bookId').get(DeleteBook)

BookRouter.route('/books/update/:bookId').put(verifyJwt,
    upload.fields([
        {
            name:'pdfLink',
            maxCount:1
        },
        {
            name:'CoverImage',
            maxCount:1
        }
    ]),UpdateBook
)

BookRouter.route('/books/:bookId').delete(verifyJwt,DeleteBook)

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


//Exporting the book router


module.exports = BookRouter