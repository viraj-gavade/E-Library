const mongoose = require('mongoose');

/**
 * Mongoose schema for Book collection
 * 
 * @schema Book
 * @description Defines the structure and validation rules for book documents
 * 
 * Fields:
 * @property {String} author - Name of the book's author
 * @property {String} CoverImage - URL/path to the book's cover image
 * @property {String} title - Title of the book
 * @property {Number} publishedInYear - Year book was published (4 digits max)
 * @property {String} pdfLink - URL/path to the book's PDF file
 * @property {Number} copies - Number of available copies (defaults to 10)
 * @property {Boolean} available - Book availability status (defaults to true)
 * @property {String} category - Book category/genre (defaults to 'Book')
 * @property {ObjectId} uploadedBy - Reference to User who uploaded the book
 * 
 * Includes timestamps:
 * - createdAt: Date document was created
 * - updatedAt: Date document was last modified
 */
const BookSchema = new mongoose.Schema({
  author: {
    type: String,
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
    maxLength: 4    // Limits year to 4 digits (e.g., 2024)
  },
  pdfLink: {
    type: String,
    type: String,    // Note: Duplicate type declaration
    required: [true, 'CoverImage must be provided!']
  },
  copies: {
    type: Number,
    default: 10     // Default number of copies
  },
  available: {
    type: Boolean,
    default: true   // Book is available by default
  },
  category: {
    type: String,
    required: [true, 'Please provide the category'],
    default: 'Book'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"     // References User model
  }
}, { timestamps: true });  // Adds createdAt and updatedAt fields

/**
 * Instance method to check book availability
 * 
 * @method isAvailable
 * @returns {Boolean} True if any copy is available, false otherwise
 * 
 * Note: Current implementation may need revision as it assumes 'copies'
 * is an array with 'available' property, but schema shows 'copies' as Number
 */
BookSchema.methods.isAvailable = function () {
    return this.copies.some(copy => copy.available);
};

// Create and export Book model
module.exports = mongoose.model('Book', BookSchema);