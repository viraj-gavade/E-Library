const Book = require('../Models/book.models')
const asyncHandlers = require('../utils/asyncHandler')
const CustomApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')
const uploadFile = require('../utils/cloudinary')
const  User = require('../Models/user.models')

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
                200,)
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
    } catch (error) {
        console.log(error)
    }
})

const searchBook = asyncHandlers(async (req, res) => {
    try {
      const { search, page = 1, limit = 10, sortBy = 'title', order = 'asc' } = req.query;
      const sort = { [sortBy]: order === 'desc' ? -1 : 1 };
      const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  
      let searchCriteria = {};
      if (search) {
        searchCriteria = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
            { genre: { $regex: search, $options: 'i' } },
          ],
        };
      }
  
      const books = await Book.find(searchCriteria).sort(sort).skip(offset).limit(parseInt(limit, 10));
  
      if (books.length === 0) {
        return res.status(200).json(
          new customApiResponse(
            200,
            'No books found!'
          )
        );
      }
  
      return res.status(200).json(
        new customApiResponse(
          200,
          'Books found successfully!',
          books
        )
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json(
        new customApiResponse(
          500,
          'An error occurred while searching for books.',
          error.message
        )
      );
    }
  });

const GetAllBooks = asyncHandlers( async (req,res)=>{

   try {
     //Add the pagaination functionality
     const book = await Book.find({}).sort('title')
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
   } catch (error) {
    console.log(error)
   }
})

const UpdateBook =asyncHandlers(  async (req,res)=>{
    try {
        const { bookId } = req.params
        if(!bookId){
            throw new CustomApiError(
                402,
                `There is no such book with id : ${bookId}`
            )
        }
        const { author , copies , title , publishedInYear } = req.body
        const book = await Book.findByIdAndUpdate(bookId,{
            author:author,
            copies:copies,
            title:title,
            publishedInYear:publishedInYear,
        },
        {
            new:true
        })
        if(!book){
            return res.status(200).json(
                new customApiResponse(
                    501,
                    `No book found please check the book id again`
                )
    
            )
        }
        return res.status(200).json(
            new customApiResponse(
                200,
                `Book details updated successfully!`,
                book
            )
    
        )
    
    } catch (error) {
        console.log(error)
    }
})



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
             CoverImage:CoverImage.url
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
     return res.status(200).json(
         new customApiResponse(
             200,
             `Book deleted  successfully!`,
         )
 
     )
   } catch (error) {
    console.log(error)
   }
})

const updatecoverImage = asyncHandlers(async(req,res)=>{
    try {
        const { bookId } = req.params
        if(!bookId){
            throw new CustomApiError(
                401,
                `   Invalid book Id : ${bookId}`
            )
        }
        console.log(req.file)//Debuggging statement remove this in the final version
        const coverImageLocalPath = req.file.path
        const CoverImage = await uploadFile(coverImageLocalPath)
        if(!CoverImage.url){
            throw new CustomApiError(
                500,
                `Something went wrong while uploading the file on cloudinary`
            )
        }
    
        const book = await Book.findByIdAndUpdate(bookId,{
            CoverImage:CoverImage.url
        },
    {
        new:true
    }
    )
    if(!book){
        throw new CustomApiError(
            501,
            `Something went wrong unable to find the book to update`
        )
    }
    
    return res.status(200).json(
        new customApiResponse(
            200,
            `Book coverImage Updated successfully!`,
            book
        )
    )
    } catch (error) {
        console.log(error)
    }
})

const updatepdfLink = asyncHandlers(async(req,res)=>{
   try {
     const { bookId } = req.params
     if(!bookId){
         throw new CustomApiError(
             401,
             `   Invalid book Id : ${bookId}`
         )
     }
     const BookPdfLocalPath = req.file.path
     const pdfLink = await uploadFile(BookPdfLocalPath)
     if(!pdfLink.url){
         throw new CustomApiError(
             500,
             `Something went wrong while uploading the file on cloudinary`
         )
     }
 
     const book = await Book.findByIdAndUpdate(bookId,{
         pdfLink:pdfLink.url
     },
 {
     new:true
 }
 )
 if(!book){
     throw new CustomApiError(
         501,
         `Something went wrong unable to find the book to update`
     )
 }
 
 return res.status(200).json(
     new customApiResponse(
         200,
         `Book pdf link Updated successfully!`,
         book
     )
 )
   } catch (error) {
    console.log(error)
   }
})

const Toggleavaialablestatus = asyncHandlers(async(req,res)=>{
    try {
        const {bookId} = req.params
        const book = await Book.findById(bookId)
    
        if(!book){
            throw new CustomApiError(
                402,
                `There is no such book with id : ${bookId}`
            )
        }
        book.available=!book.available
        await book.save({validateBeforeSave:false})
        if(book.available===true){
            return res.status(200).json(

                new customApiResponse(
                    200,
    
                    'Book is available!'
                )
             )
        }
        return res.status(200).json(

            new customApiResponse(
                200,

                'Book is not available!'
            )
         )

        
    } catch (error) {
        console.log(error)
    }
})

module.exports =
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
}