//MAKE A ADMIN CONTROLLER SUCH THAT ONLY ADMIN IS ABLE TO SEE ALL THE USER DATA AND ADD AND DELETE THE BOOKS

const Admin = require('../Models/admin.models')
const asyncHandlers = require('../utils/asyncHandler')
const uploadFile = require('../utils/cloudinary')
const customApiError = require('../utils/customApiError')
const jwt = require('jsonwebtoken')
const { changeUserPassword } = require('./user.controllers')
const CustomApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')
const options ={
    httpOnly:true,
     secure:true
}

const generateAccessTokenAndRefreshToken = async(userId)=>{
    try {
        const admin =  await Admin.findById(userId)
        const accessToken = await admin.generateAccessToken()
        const refreshToken = await admin.generateRefreshToken()
        console.log(accessToken,refreshToken)
        user.refreshToken=refreshToken
        await admin.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new CustomApiError(
            501,
            'Something went wrong while generating the access and refersh token!'
        )
    }
}

const RegisterAdmin = asyncHandlers(async(req,res)=>{
    const {username,password,email,profileImg}= req.body
    const profileImgLocalpath = req.file?.path
    if(!profileImgLocalpath){
        throw new customApiError(
            402,
            'Unable to find the local path of the profile picture!'
        )
    }

    const ProfileImg = await uploadFile(profileImgLocalpath)

    if(!ProfileImg.url){
        throw new  customApiError(
            501,
            'Something went wrong while uploading the on cloudinary'
        )
    }

    if(!username || !password ||!email || !profileImg){
        throw new CustomApiError(
            402,
            'Please fill all the necessary fields in order register the admin'
        )
    }
    const admin = await Admin.create({
        username:username,
        password:password,
        email:email,
        profileImg:ProfileImg.url
    })

    const checkadmin = await Admin.findById(admin?._id)
    if(!checkadmin){
        throw new customApiError(
            501,
            'Something went wrong while creating the admin please try again later!'
        )
    }

    return res.status(200).json(
        new customApiResponse(
            200,
            'Admin registered successfully!'
        )
    )
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
ChangeAdminPassword
generateAccessTokenAndRefreshToken
}