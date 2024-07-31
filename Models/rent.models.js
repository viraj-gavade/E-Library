const mongoose = require('mongoose')

const RentBookSchema = new mongoose.Schema({
    author:{
        type:String,
        required:[true,'Please provide the author name']
    },title:{
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
    },
    acquiredBy : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    acquiredAt:{
        type:String,
        acquiredate:Date
    }
},{timestamps:true})

module.exports = mongoose.model('Rent',RentBookSchema)