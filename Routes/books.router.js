const express = require('express')

const upload = require('../Middlewares/multer.middleware')


const BookRouter = express.Router()



//Main Routes

BookRouter.route('/books').get(GetAllBooks)

BookRouter.route('/books/:bookId').get(GetSingleBook)

BookRouter.route('/books/:bookId').patch(UpdateBook)

BookRouter.route('/books/:bookId').delete(DeleteBook)

BookRouter.route('/books/').post(
    upload.single('Book'),UploadBook
) ///Middleware to upload book with the help of cloudinary



//Exporting the book router


module.exports = BookRouter