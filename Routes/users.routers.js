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


UserRouter.route('/signup').post(
    upload.single('profileImg'),registerUser).get((req,res)=>{
        res.render('signup')
    })
UserRouter.route('/signin').post(loginUser).get((req,res)=>{
    res.render('signin')
})
UserRouter.route('/signout').get(logoutUser)
UserRouter.route('/edit-profile').get(verifyJwt,async(req,res)=>{
    res.render('editProfile',{
        user:req.user
    })
})
UserRouter.route('/profile').get(verifyJwt,getuserprofile)
UserRouter.route('/change-password').post(verifyJwt,changeUserPassword) 
UserRouter.route('/change-email').post(verifyJwt,changeUserEmail) 
UserRouter.route('/change-username').post(verifyJwt,changeUserUsername) 
UserRouter.route('/change-profile-picture').post(verifyJwt,upload.single('profileImg'),changeUserProfilePicture)    
UserRouter.route('/mybooks').get(verifyJwt,getUserAllBooks)






//Exporting the router

module.exports = UserRouter