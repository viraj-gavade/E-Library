// Import required dependencies
const express = require('express')
const Book = require('../Models/book.models')
const {
    UpdateBook,
    UploadBook,
    DeleteBook,
} = require('../Controllers/book.controllers')
const upload = require('../Middlewares/multer.middleware')
const verifyJwt = require('../Middlewares/auth.middleware')

// Initialize Express Router
const BookRouter = express.Router()

/**
 * @route GET /books/edit-book/:bookId
 * @description Renders the edit book page with book details
 * @middleware verifyJwt - Ensures user is authenticated
 * @param {string} bookId - MongoDB ObjectId of the book
 * @returns {View} Renders editbook view with user and book data
 */
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
 
/**
 * @route GET /books/:bookId
 * @description Endpoint to delete a book (legacy route)
 * @param {string} bookId - MongoDB ObjectId of the book
 */
BookRouter.route('/books/:bookId').get(DeleteBook)

/**
 * @route PUT /books/update/:bookId
 * @description Updates an existing book's details and files
 * @middleware verifyJwt - Ensures user is authenticated
 * @middleware upload.fields - Handles multiple file uploads (PDF and Cover Image)
 * @param {string} bookId - MongoDB ObjectId of the book
 */
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

/**
 * @route DELETE /books/:bookId
 * @description Deletes a book from the system
 * @middleware verifyJwt - Ensures user is authenticated
 * @param {string} bookId - MongoDB ObjectId of the book
 */
BookRouter.route('/books/:bookId').delete(verifyJwt,DeleteBook)

/**
 * @route POST /books
 * @description Creates a new book with uploaded files
 * @middleware verifyJwt - Ensures user is authenticated
 * @middleware upload.fields - Handles multiple file uploads
 * @note Files are processed and stored using cloudinary service
 */
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
)

// Export the router for use in main application
module.exports = BookRouter