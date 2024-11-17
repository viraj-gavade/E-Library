/**
 * @fileoverview User Management Router
 * Handles all user-related operations including authentication, profile management,
 * and user-specific book operations
 */

const express = require('express')
const { 
    loginUser, 
    registerUser, 
    logoutUser, 
    changeUserPassword, 
    changeUserProfilePicture, 
    refreshAccessTokenandRefreshToken, 
    changeUserUsername, 
    changeUserEmail,
    getUserAllBooks, 
    getUserDownloads, 
    getBookDownloads,
    getuserprofile
 } = require('../Controllers/user.controllers')
const upload = require('../Middlewares/multer.middleware')
const verifyJwt = require('../Middlewares/auth.middleware')
const { getBooksUser } = require('../Controllers/book.controllers')
const UserRouter = express.Router()

/**
 * @route POST & GET /signup
 * @description Handle user registration and signup page rendering
 * @middleware upload.single('profileImg') - Handles profile picture upload
 * @returns {View} GET - Returns signup page
 * @returns {JSON} POST - Returns new user data or error
 */
UserRouter.route('/signup').post(
    upload.single('profileImg'),registerUser).get((req,res)=>{
        res.render('signup')
    })

/**
 * @route POST & GET /signin
 * @description Handle user login and signin page rendering
 * @returns {View} GET - Returns signin page
 * @returns {JSON} POST - Returns authentication tokens or error
 */
UserRouter.route('/signin').post(loginUser).get((req,res)=>{
    res.render('signin')
})

/**
 * @route GET /signout
 * @description Handle user logout by clearing tokens
 * @returns {Response} Redirects to home page after logout
 */
UserRouter.route('/signout').get(logoutUser)

/**
 * @route GET /edit-profile
 * @description Render profile editing page
 * @middleware verifyJwt - Ensures user is authenticated
 * @returns {View} Returns edit profile page with user data
 */
UserRouter.route('/edit-profile').get(verifyJwt,async(req,res)=>{
    res.render('editProfile',{
        user:req.user
    })
})

/**
 * @route GET /profile
 * @description Fetch and display user profile
 * @middleware verifyJwt - Ensures user is authenticated
 * @returns {JSON} Returns user profile data
 */
UserRouter.route('/profile').get(verifyJwt,getuserprofile)

/**
 * @route POST /change-password
 * @description Update user's password
 * @middleware verifyJwt - Ensures user is authenticated
 * @returns {JSON} Success message or error
 */
UserRouter.route('/change-password').post(verifyJwt,changeUserPassword) 

/**
 * @route POST /change-email
 * @description Update user's email address
 * @middleware verifyJwt - Ensures user is authenticated
 * @returns {JSON} Success message or error
 */
UserRouter.route('/change-email').post(verifyJwt,changeUserEmail) 

/**
 * @route POST /change-username
 * @description Update user's username
 * @middleware verifyJwt - Ensures user is authenticated
 * @returns {JSON} Success message or error
 */
UserRouter.route('/change-username').post(verifyJwt,changeUserUsername) 

/**
 * @route POST /change-profile-picture
 * @description Update user's profile picture
 * @middleware verifyJwt - Ensures user is authenticated
 * @middleware upload.single('profileImg') - Handles new profile picture upload
 * @returns {JSON} Success message with new image URL or error
 */
UserRouter.route('/change-profile-picture').post(verifyJwt,upload.single('profileImg'),changeUserProfilePicture)    

/**
 * @route GET /mybooks
 * @description Fetch all books associated with the user
 * @middleware verifyJwt - Ensures user is authenticated
 * @returns {JSON} Array of user's books or error
 */
UserRouter.route('/mybooks').get(verifyJwt,getUserAllBooks)

// Export the router for use in main application
module.exports = UserRouter