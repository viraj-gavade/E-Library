const Book = require('../Models/book.models')
const asyncHandlers = require('../utils/asyncHandler')
const CustomApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')
const uploadFile = require('../utils/cloudinary')

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
    const { author , copies , title , publishedInYear } = req.body
    if(!author && !copies && !title , !publishedInYear ){
        throw new customApiResponse(
            401,
            `All fields must be provided!`
        )
    }
    if(!bookId){
        return res.status(200).json(
            new customApiResponse(
                200,
                `Invalid Book Id : ${bookId}`
            )
        )
    }

    //TODO:Write an functionality to change the link of the pdf uploaded and cover photo of book


    const book = await Book.findByIdAndUpdate(bookId,{
        author:author,
        copies:copies,
        title:title,
        publishedInYear:publishedInYear
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

})



const UploadBook =asyncHandlers(   async(req,res)=>{
    console.log(req.files)
    const {author , title ,copies , publishedInYear , available  }  = req.body
    if(!author ||! title ||!copies ||! publishedInYear ||! available  ){
        throw new CustomApiError(
            401,
            `All fields are required!`
        )
    }

    const coverImageLocalPath = req.files.CoverImage[0].path
    const BookPdfLocalPath = req.files.pdfLink[0].path
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
            available:available,
            pdfLink:pdfLink.url,
            copies:copies,
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

})


const DeleteBook = asyncHandlers( async(req,res)=>{
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
            `Book details updated successfully!`,
            book
        )

    )
})

const updatecoverImage = asyncHandlers(async(req,res)=>{
    const { bookId } = req.params
    if(!bookId){
        throw new CustomApiError(
            401,
            `   Invalid book Id : ${bookId}`
        )
    }
    console.log(req.file)
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
})

const updatepdfLink = asyncHandlers(async(req,res)=>{
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
})

module.exports =
{
    GetAllBooks,
    GetSingleBook,
    UpdateBook,
    UploadBook,
    DeleteBook,
    updatecoverImage,
    updatepdfLink
}