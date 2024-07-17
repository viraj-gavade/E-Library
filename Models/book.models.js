const mongoose = require('mongoose')

const BooksSchema = new mongoose.Schema({
    author:{
        type:String,
        required:[true,'Please provide the author name']
    },
    available:{
        type:Boolean,
        default:true
    }, //TODO:Create a seprate toggle fucntion to toggle this easily for any book
    copies:{
        type:Number,
        default:3
    },
    title:{
        type:String,
        required:[true,'Please provide the title of the book']
    },
    publishedInYear:{
        type:Number,
        MaxLength:4
    },
    pdfLink:{
        type:String,
        reuired:true
    },
    CoverImage:{
        type:String,
        required:[true,'CoverImage must be provided!']
    }
},{timestamps:true})


module.exports = mongoose.model('Book',BooksSchema)