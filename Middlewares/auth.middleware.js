const User = require('../Models/user.models')
const jwt = require('jsonwebtoken')
const CustomApiError = require('../utils/customApiError')
const asyncHandlers = require('../utils/asyncHandler')

/**
 * Middleware to verify JWT tokens and authenticate requests
 * 
 * Authentication flow:
 * 1. Extracts token from cookies or Authorization header
 * 2. Verifies token validity using JWT_SECRET
 * 3. Retrieves corresponding user from database
 * 4. Attaches user object to request
 * 
 * @middleware
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Token sources (in order of precedence):
 * 1. req.cookies.accessToken
 * 2. Authorization header (Bearer token)
 * 
 * Error handling:
 * - Redirects to signup if no token found
 * - Redirects to signup if user not found
 * - Throws CustomApiError for other JWT verification failures
 * 
 * Security notes:
 * - Excludes password and refreshToken from user data
 * - Accepts Bearer token format in Authorization header
 */
const verifyJwt = asyncHandlers(async(req,res,next)=>{
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ','')
        
        // Redirect to signup if no token found
        if(!token){
           return res.redirect('/api/v1/library/user/signup')
        }

        // Verify token and decode user ID
        const decodeToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRETE)
        
        // Find user while excluding sensitive fields
        const user = await User.findById(decodeToken?._id).select('-password -refreshToken')
        
        // Redirect to signup if user not found
        if(!user){
            return res.redirect('/api/v1/library/user/signup')
        }

        // Attach user to request for downstream middleware
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        throw new CustomApiError(
            error.statusCode,
            error.message
        )
    }
})

module.exports = verifyJwt