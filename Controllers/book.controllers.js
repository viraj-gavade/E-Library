const Book = require('../Models/book.models')
const asyncHandlers = require('../utils/asyncHandler')
const CustomApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')
const uploadFile = require('../utils/cloudinary')
const  User = require('../Models/user.models')
const { default: mongoose } = require('mongoose')
const Download = require('../Models/downloadBook.models')

const GetSingleBook =asyncHandlers(  async(req,res)=>{
    try {
        const { bookId } = req.params
        if(!bookId){
            throw new CustomApiError(
                401,
                `There is no such book with Id : ${bookId}`
            )
        }
        const book = await Book.findById(bookId).select('-users')
        if(!book){
            return res.status(200).json( new customApiResponse(
                200,
                `There is no such book with Id:${bookId}`)
             )
        }
        return res.status(200).json(
            new customApiResponse(
                200,
                'Book found successfully!',
                book
            )
        )
    } catch (error) {
        console.log(error)
    }
})

const UpdateBook = asyncHandlers(async (req, res, next) => {
    try {
        const { author, title, publishedInYear, copies } = req.body;
        const { bookId } = req.params;

        if (!bookId) {
            throw new CustomApiError(402, `No book found with id: ${bookId}`);
        }

        const coverImageLocalPath = req.files?.CoverImage?.[0]?.path || "ND";
        const bookPdfLocalPath = req.files?.pdfLink?.[0]?.path || "ND";

        console.log("Cover Image Path:", coverImageLocalPath);
        console.log("Book PDF Path:", bookPdfLocalPath);

        let pdfLink = null;
        let CoverImage = null;

        if (coverImageLocalPath !== "ND") {
            CoverImage = await uploadFile(coverImageLocalPath);
        }
        if (bookPdfLocalPath !== "ND") {
            pdfLink = await uploadFile(bookPdfLocalPath);
        }

        const existingBook = await Book.findById(bookId);
        if (!existingBook) {
            throw new CustomApiError(404, "Book not found");
        }
        console.log('Existing Book:_',existingBook)

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

      return  res.status(200).json({msg:"Book updated sucessfully!"});
    } catch (error) {
        console.error(error);
      console.log(error)
    }
});

const UploadBook =asyncHandlers(   async(req,res)=>{
   try {
     console.log(req.files)
     const {author , title  , publishedInYear}  = req.body
     if(!author ||! title  ||! publishedInYear ){
         throw new CustomApiError(
             401,
             `All fields are required!`
         )
     }
 
     const coverImageLocalPath = req.files.CoverImage[0].path
     const BookPdfLocalPath = req.files.pdfLink[0].path

     console.log(coverImageLocalPath,BookPdfLocalPath)//Debugging statements remove this in final  commit

     if(!BookPdfLocalPath || ! coverImageLocalPath){
         throw new CustomApiError(
             401,
             'NO PDF file and coverImage local path was provided please try again later!'
         )
     }
     const pdfLink = await uploadFile(BookPdfLocalPath)
     const CoverImage = await uploadFile(coverImageLocalPath)
     if(!pdfLink.url || !CoverImage.url){
         throw new  CustomApiError(
             500,
             'Something went wrong while uploading the file on cloudinary!'
         )
     }
 
     const OGbook = await Book.create(
         {
             author:author,
             title:title,
             publishedInYear:publishedInYear,
             pdfLink:pdfLink.url,
             //Work on copies next time by deafault value will not work every time.
             CoverImage:CoverImage.url,
             uploadedBy:req.user._id
         }
     )
 
     const book = await Book.findById(OGbook?._id)
     if(!book){
         throw new CustomApiError(
             501,
             `Soemthing went wrong unable to find the uploaded book!`
         )
     }
     return res.status(200).json(
         new customApiResponse(
             200,
             'Book uploaded successfully!',
             book
         )
     )
 
   } catch (error) {
    console.log(error)
   }
})

const DeleteBook = asyncHandlers( async(req,res)=>{
   try {
     const { bookId } = req.params
     if(!bookId){
         return res.status(200).json(
             new customApiResponse(
                 200,
                 `Invalid Book Id : ${bookId}`
             )
         )
     }
     const book = await Book.findByIdAndDelete(bookId)
     if(!book){
         return res.status(200).json(
             new customApiResponse(
                 501,
                 `No book found please check the book id again`
             )
 
         )
     }
     return res.status(200).redirect('/api/v1/library/user/mybooks')
   } catch (error) {
    console.log(error)
   }
})




module.exports =
{
    GetSingleBook,
    UpdateBook,
    UploadBook,
    DeleteBook,
}