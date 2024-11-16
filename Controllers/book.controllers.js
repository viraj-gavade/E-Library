const Book = require('../Models/book.models'); // Importing the Book model for database operations
const asyncHandlers = require('../utils/asyncHandler'); // Middleware to handle asynchronous route errors
const CustomApiError = require('../utils/customApiError'); // Custom error handling utility
const customApiResponse = require('../utils/customApiResponse'); // Custom response formatting utility
const uploadFile = require('../utils/cloudinary'); // Utility to upload files to Cloudinary
const User = require('../Models/user.models'); // Importing the User model
const { default: mongoose } = require('mongoose'); // Importing mongoose for database interaction


// Handler to fetch details of a single book by its ID
const GetSingleBook = asyncHandlers(async (req, res) => {
    try {
        const { bookId } = req.params; // Extract bookId from request parameters
        if (!bookId) {
            throw new CustomApiError(
                401,
                `There is no such book with Id : ${bookId}` // Error for missing bookId
            );
        }
        const book = await Book.findById(bookId).select('-users'); // Fetch book details excluding users field
        if (!book) {
            return res.status(200).json(new customApiResponse(
                200,
                `There is no such book with Id:${bookId}` // Response if book is not found
            ));
        }
        return res.status(200).json(
            new customApiResponse(
                200,
                'Book found successfully!', // Success response with book details
                book
            )
        );
    } catch (error) {
        console.log(error); // Log errors for debugging
    }
});

// Handler to update book details by its ID
const UpdateBook = asyncHandlers(async (req, res, next) => {
    try {
        const { author, title, publishedInYear, copies } = req.body; // Extract book details from request body
        const { bookId } = req.params; // Extract bookId from request parameters

        if (!bookId) {
            throw new CustomApiError(402, `No book found with id: ${bookId}`); // Error for missing bookId
        }

        // Extract file paths from uploaded files
        const coverImageLocalPath = req.files?.CoverImage?.[0]?.path || "ND";
        const bookPdfLocalPath = req.files?.pdfLink?.[0]?.path || "ND";

        console.log("Cover Image Path:", coverImageLocalPath); // Debugging log
        console.log("Book PDF Path:", bookPdfLocalPath); // Debugging log

        let pdfLink = null;
        let CoverImage = null;

        // Upload files to Cloudinary if provided
        if (coverImageLocalPath !== "ND") {
            CoverImage = await uploadFile(coverImageLocalPath);
        }
        if (bookPdfLocalPath !== "ND") {
            pdfLink = await uploadFile(bookPdfLocalPath);
        }

        const existingBook = await Book.findById(bookId); // Check if the book exists
        if (!existingBook) {
            throw new CustomApiError(404, "Book not found"); // Error if book is not found
        }
        console.log('Existing Book:_', existingBook); // Debugging log

        // Update book details
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            {
                author: author ?? existingBook.author,
                copies: copies ?? existingBook.copies,
                title: title ?? existingBook.title,
                publishedInYear: publishedInYear ?? existingBook.publishedInYear,
                pdfLink: pdfLink?.url ?? existingBook.pdfLink,
                CoverImage: CoverImage?.url ?? existingBook.CoverImage
            },
            { new: true }
        );

        return res.status(200).json({ msg: "Book updated successfully!" }); // Success response
    } catch (error) {
        console.error(error); // Log errors for debugging
    }
});

// Handler to upload a new book
const UploadBook = asyncHandlers(async (req, res) => {
    try {
        console.log(req.files); // Debugging log for uploaded files
        const { author, title, publishedInYear } = req.body; // Extract book details from request body
        if (!author || !title || !publishedInYear) {
            throw new CustomApiError(
                401,
                `All fields are required!` // Error for missing fields
            );
        }

        // Extract file paths from uploaded files
        const coverImageLocalPath = req.files.CoverImage[0].path;
        const BookPdfLocalPath = req.files.pdfLink[0].path;

        console.log(coverImageLocalPath, BookPdfLocalPath); // Debugging log

        if (!BookPdfLocalPath || !coverImageLocalPath) {
            throw new CustomApiError(
                401,
                'NO PDF file and coverImage local path was provided please try again later!' // Error for missing files
            );
        }

        // Upload files to Cloudinary
        const pdfLink = await uploadFile(BookPdfLocalPath);
        const CoverImage = await uploadFile(coverImageLocalPath);

        if (!pdfLink.url || !CoverImage.url) {
            throw new CustomApiError(
                500,
                'Something went wrong while uploading the file on Cloudinary!' // Error for upload failure
            );
        }

        // Create new book entry in the database
        const OGbook = await Book.create({
            author: author,
            title: title,
            publishedInYear: publishedInYear,
            pdfLink: pdfLink.url,
            CoverImage: CoverImage.url,
            uploadedBy: req.user._id
        });

        const book = await Book.findById(OGbook?._id); // Fetch the newly created book
        if (!book) {
            throw new CustomApiError(
                501,
                `Something went wrong unable to find the uploaded book!` // Error for missing book
            );
        }
        return res.status(200).json(
            new customApiResponse(
                200,
                'Book uploaded successfully!',
                book // Success response with book details
            )
        );
    } catch (error) {
        console.log(error); // Log errors for debugging
    }
});

// Handler to delete a book by its ID
const DeleteBook = asyncHandlers(async (req, res) => {
    try {
        const { bookId } = req.params; // Extract bookId from request parameters
        if (!bookId) {
            return res.status(200).json(
                new customApiResponse(
                    200,
                    `Invalid Book Id : ${bookId}` // Response for missing bookId
                )
            );
        }
        const book = await Book.findByIdAndDelete(bookId); // Delete the book
        if (!book) {
            return res.status(200).json(
                new customApiResponse(
                    501,
                    `No book found please check the book id again` // Response if book is not found
                )
            );
        }
        return res.status(200).redirect('/api/v1/library/user/mybooks'); // Redirect after successful deletion
    } catch (error) {
        console.log(error); // Log errors for debugging
    }
});

// Exporting all handlers as a module
module.exports = {
    GetSingleBook,
    UpdateBook,
    UploadBook,
    DeleteBook,
};
