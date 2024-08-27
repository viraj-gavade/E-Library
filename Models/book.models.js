const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  author: {
    type:String,
    required: true
  },
  CoverImage: {
    type: String,
    required: [true, 'Please provide the author name']
  },
  title: {
    type: String,
    required: [true, 'Please provide the title of the book']
  },
  publishedInYear: {
    type: Number,
    maxLength: 4
  },
  pdfLink: {
    type: String,
    type: String,
    required: [true, 'CoverImage must be provided!']
  },
  copies: {
    type: Number,
    default: 10
  },
  available:{
    type:Boolean,
    default:true
    
  },
  category:{
    type:String,
    required:[true,'Please provide the category'],
    default:'Book'
  },
  uploadedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
}, { timestamps: true });

BookSchema.methods.isAvailable = function () {
    return this.copies.some(copy => copy.available);
  };

module.exports = mongoose.model('Book', BookSchema);
