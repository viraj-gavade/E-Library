const mongoose = require('mongoose');

const CopySchema = new mongoose.Schema({
  available: {
    type: Boolean,
    default: true
  },
  rentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rentedAt: {
    type: Date,
    default: null
  }
});

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
  coverImage: {
    type: String,
    required: [true, 'CoverImage must be provided!']
  },
  copies: {
    type: [CopySchema],
    default: []
  }
}, { timestamps: true });

BookSchema.methods.isAvailable = function () {
    return this.copies.some(copy => copy.available);
  };

module.exports = mongoose.model('Book', BookSchema);
