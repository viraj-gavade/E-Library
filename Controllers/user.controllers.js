const User = require('../Models/user.models')
const asyncHandlers = require('../utils/asyncHandler')
const CustomApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')
const uploadFile = require('../utils/cloudinary')



const registerUser = asyncHandlers(async(req,res)=>{
    res.send('This is a  register User Route')
})

const loginUser = asyncHandlers(async(req,res)=>{
    res.send('This is a  login User Route')
})

const logoutUser = asyncHandlers(async(req,res)=>{
    res.send('This is a  logout User Route')
})


const refreshAccessTokenandRefreshToken = asyncHandlers(async(req,res)=>{
    res.send('This is  refresh access refersh and access token route!')
})


const changeUserPassword = asyncHandlers(async(req,res)=>{
    res.send('This is change user password route')
})


const changeUserProfilePicture = asyncHandlers(async(req,res)=>{
    res.send('This is user change profile picture route')
})

module.exports ={
    registerUser,  
    loginUser,
    logoutUser,
    refreshAccessTokenandRefreshToken,
    changeUserPassword,
    changeUserProfilePicture,
}