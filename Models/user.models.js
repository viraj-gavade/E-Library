const { match } = require('assert');
const { kMaxLength } = require('buffer')
const mongoose = require('mongoose')
const { type } = require('os')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * Mongoose schema for User collection
 * 
 * @schema User
 * @description Defines the structure for user documents with authentication capabilities
 * 
 * Main features:
 * - Username/password authentication
 * - Password hashing with bcrypt
 * - JWT token generation
 * - Profile management
 * - Book collection tracking
 */
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            kMaxLength: 16,                           // Maximum length for username
            required: [true, 'Please provide the username'],
            unique: [true, 'Username must be unique'],
            lowercase: true,                          // Store username in lowercase
        },
        password: {
            type: String,
            // kMaxLength: 16,                        // Commented out as it might limit hashed password
            required: [true, 'Please provide the username']  // Note: Error message should be updated
        },
        email: {
            type: String,
            kMaxLength: 16,                           // Maximum length for email
            required: [true, 'Please provide the username'],  // Note: Error message should be updated
            lowercase: true,
            unique: true
        },
        profileImg: {
            type: String,
            required: false                           // Optional profile image
        },
        bio: {
            type: String,
            required: false,
            default: ''                               // Empty bio by default
        },
        refreshToken: {
            type: String,                             // Stores JWT refresh token
        },
        books: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Books"                          // References to user's book collection
            }
        ],
    },
    { timestamps: true }                             // Adds createdAt and updatedAt fields
)

/**
 * Pre-save middleware to hash password
 * 
 * Triggers before saving user document:
 * 1. Checks if password was modified
 * 2. Generates salt with cost factor 10
 * 3. Hashes password with salt
 * 
 * @middleware
 */
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next()
    }
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
})

/**
 * Instance method to verify password
 * 
 * @method isPasswordCorrect
 * @param {string} UserPassword - Plain text password to verify
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
UserSchema.methods.isPasswordCorrect = async function(UserPassword) {
    return await bcryptjs.compare(UserPassword, this.password)
}

/**
 * Instance method to generate JWT access token
 * 
 * @method generateAccessToken
 * @returns {Promise<string>} JWT access token
 * 
 * Token contains:
 * - User ID
 * - Expiration as per ACCESS_TOKEN_EXPIRY env variable
 * - Signed with ACCESS_TOKEN_SECRETE
 */
UserSchema.methods.generateAccessToken = async function() {
    const accessToken = await jwt.sign({
        _id: this._id
    }, process.env.ACCESS_TOKEN_SECRETE, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
    return accessToken
}

/**
 * Instance method to generate JWT refresh token
 * 
 * @method generateRefreshToken
 * @returns {Promise<string>} JWT refresh token
 * 
 * Token contains:
 * - User ID
 * - Expiration as per REFRESH_TOKEN_EXPIRY env variable
 * - Signed with REFRESH_TOKEN_SECRETE
 */
UserSchema.methods.generateRefreshToken = async function() {
    const accessToken = await jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRETE, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
    return accessToken
}

module.exports = mongoose.model('User', UserSchema)