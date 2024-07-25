//MAKE A ADMIN CONTROLLER SUCH THAT ONLY ADMIN IS ABLE TO SEE ALL THE USER DATA AND ADD AND DELETE THE BOOKS

const Admin = require('../Models/admin.models')
const asyncHandlers = require('../utils/asyncHandler')
const uploadFile = require('../utils/cloudinary')
const customApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')
const jwt = require('jsonwebtoken')
const { changeUserPassword } = require('./user.controllers')
const options ={
    httpOnly:true,
     secure:true
}


const RegisterAdmin = asyncHandlers(async(req,res)=>{
    res.send('This is register admin route for test!')
})



const LoginAdmin = asyncHandlers(async(req,res)=>{
    res.send('This is login admin route for test!')
})



const LogoutAdmin = asyncHandlers(async(req,res)=>{
    res.send('This is logout admin route for test!')
})


const ChangeAdminPassword = asyncHandlers(async(req,res)=>{
    res.send('This is change admin password route for test!')
})


const ChangeAdminUsername = asyncHandlers(async(req,res)=>{
    res.send('This is change  admin username route for test!')
})


const ChangeAdminEmail = asyncHandlers(async(req,res)=>{
    res.send('This is change  admin  email route for test!')
})



module.exports={
LoginAdmin,
LogoutAdmin,
RegisterAdmin,
ChangeAdminEmail,
ChangeAdminUsername,
changeUserPassword
}