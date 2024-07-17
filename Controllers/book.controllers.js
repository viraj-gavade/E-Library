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
    const book = await  Book.find({})
    if(book.length<1){
        return res.status(200).json(
            new customApiResponse(
                200,
                `No books found !`
            )
        )
    }
    return res.status(200).json(
        new customApiResponse(
            200,
            `All books fetched successfully!`,
            book
        )
    )
})



const UpdateBook =asyncHandlers(  async (req,res)=>{
    const { bookId } = req.params
    
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