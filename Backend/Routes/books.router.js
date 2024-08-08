const express = require('express')
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
    searchBook
} = require('../Controllers/book.controllers')

const upload = require('../Middlewares/multer.middleware')


const BookRouter = express.Router()



//Main Routes

BookRouter.route('/books').get(GetAllBooks)
BookRouter.route('/books/search').get(searchBook)


BookRouter.route('/books/:bookId').get(GetSingleBook)

BookRouter.route('/books/:bookId').patch(UpdateBook)

BookRouter.route('/books/:bookId').delete(DeleteBook)

BookRouter.route('/books/coverImage/:bookId').patch(
    upload.single('CoverImage'),updatecoverImage)


BookRouter.route('/books/pdfLink/:bookId').patch(upload.single('pdfLink'),updatepdfLink)


BookRouter.route('/books').post(
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

BookRouter.route('/books/status/:bookId').get(Toggleavaialablestatus
    
)



//Exporting the book router


module.exports = BookRouter