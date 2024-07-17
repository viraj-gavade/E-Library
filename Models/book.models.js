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
    link:{
        type:String,
        reuired:true
    }
    //TODO:Add a cover iamge field which will be string of link of image from cloduinary and admin can change the cover iamge

},{timestamps:true})


module.exports = mongoose.model('Book',BooksSchema)