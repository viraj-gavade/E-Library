const express = require('express')
const { loginUser, registerUser, logoutUser, changeUserPassword, changeUserProfilePicture, refreshAccessTokenandRefreshToken } = require('../Controllers/user.controllers')

const UserRouter = express.Router()


UserRouter.route('/register').post(registerUser)
UserRouter.route('/login').post(loginUser)
UserRouter.route('/login').get(logoutUser)
UserRouter.route('/change-password').patch(changeUserPassword)
UserRouter.route('/change-profile-picture').patch(changeUserProfilePicture)
UserRouter.route('/change-profile-picture').get(refreshAccessTokenandRefreshToken)



//Exporting the router

module.exports = UserRouter