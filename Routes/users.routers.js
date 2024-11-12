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
    getBookDownloads
 } = require('../Controllers/user.controllers')
const upload = require('../Middlewares/multer.middleware')
const verifyJwt = require('../Middlewares/auth.middleware')
const { getBooksUser } = require('../Controllers/book.controllers')
const UserRouter = express.Router()


UserRouter.route('/signup').post(
    upload.single('profileImg'),registerUser).get((req,res)=>{
        res.render('signup')
    })
UserRouter.route('/signin').post(verifyJwt,loginUser).get((req,res)=>{
    res.render('signin')
})
UserRouter.route('/signout').get(logoutUser)
UserRouter.route('/change-password').patch(verifyJwt,changeUserPassword) 
UserRouter.route('/change-email').patch(verifyJwt,changeUserEmail) 
UserRouter.route('/change-username').patch(verifyJwt,changeUserUsername) 
UserRouter.route('/change-profile-picture').patch(verifyJwt,upload.single('profileImg'),changeUserProfilePicture)    
UserRouter.route('/refresh').get(verifyJwt,refreshAccessTokenandRefreshToken)
UserRouter.route('/mybooks').get(verifyJwt,getUserAllBooks)
UserRouter.route('/downloads').get(verifyJwt,getUserDownloads)
UserRouter.route('/downloads/:bookId').get(verifyJwt,getBookDownloads)





//Exporting the router

module.exports = UserRouter