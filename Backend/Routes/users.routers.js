const express = require('express')
const { loginUser, registerUser, logoutUser, changeUserPassword, changeUserProfilePicture, refreshAccessTokenandRefreshToken, changeUserUsername, changeUserEmail } = require('../Controllers/user.controllers')
const upload = require('../Middlewares/multer.middleware')
const verifyJwt = require('../Middlewares/auth.middleware')
const UserRouter = express.Router()


UserRouter.route('/register').post(
    upload.single('profileImg'),registerUser)
UserRouter.route('/login').post(loginUser)
UserRouter.route('/logout').get(logoutUser)
UserRouter.route('/change-password').patch(verifyJwt,changeUserPassword) 
UserRouter.route('/change-email').patch(verifyJwt,changeUserEmail) 
UserRouter.route('/change-username').patch(verifyJwt,changeUserUsername) 
UserRouter.route('/change-profile-picture').patch(verifyJwt,upload.single('profileImg'),changeUserProfilePicture)    

UserRouter.route('/refresh').get(verifyJwt,refreshAccessTokenandRefreshToken)



//Exporting the router

module.exports = UserRouter