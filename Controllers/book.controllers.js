const Book = require('../Models/book.models')
const asyncHandlers = require('../utils/asyncHandler')

// Get all books of the library and them by alphabetical order by deafult and some additional sorting fucntionalities
// Like sorty by year , author in alphabetical odrder

const GetSingleBook =asyncHandlers(  async(req,res)=>{
    res.send('This is get single book router')
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