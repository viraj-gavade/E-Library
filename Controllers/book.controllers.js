const Book = require('../Models/book.models')
const asyncHandlers = require('../utils/asyncHandler')
const CustomApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')

// Get all books of the library and them by alphabetical order by deafult and some additional sorting fucntionalities
// Like sorty by year , author in alphabetical odrder

const GetSingleBook =asyncHandlers(  async(req,res)=>{
    const { bookId } = req.params
    if(!bookId){
        throw new CustomApiError(
            401,
            `There is no such book with Id : ${bookId}`
        )
    }
    const book = await Book.findById(bookId)
    if(!book){
         new customApiResponse(
            200,
            `There is no such book with Id:${book}`
         )
    }
    return res.status(200).json(
        new customApiResponse(
            200,
            'Book found successfully!',
            book
        )
    )
})
const GetAllBooks = asyncHandlers( async (req,res)=>{
    res.send('This is get all book router')
})
const UpdateBook =asyncHandlers(  async (req,res)=>{
    res.send('This is get update book router')
})
const UploadBook =asyncHandlers(   async(req,res)=>{
    res.send('This is get upload book router')
})
const DeleteBook = asyncHandlers( async(req,res)=>{
    res.send('This is get delete book router')
})

module.exports =
{
    GetAllBooks,
    GetSingleBook,
    UpdateBook,
    UploadBook,
    DeleteBook
}