const mongoose = require('mongoose')

const BooksSchema = new mongoose.Schema({
    author:{
        type:String,
        required:[true,'Please provide the author name']
    },
    available:{
        type:Boolean,
        default:true
    },
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
    }
})


module.exports = mongoose.model('Book',BooksSchema)