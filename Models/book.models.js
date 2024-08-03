const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  author: {
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
    required: true
  },
  CoverImage: {
    type: String,
    required: [true, 'CoverImage must be provided!']
  },
  copies: {
    type: Number,
    default: 10
  }
}, { timestamps: true });

BookSchema.methods.isAvailable = function () {
    return this.copies.some(copy => copy.available);
  };

module.exports = mongoose.model('Book', BookSchema);
