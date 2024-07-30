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
    const {email,password,username} = req.body
    if(!email || !password || !username){
        throw new customApiError(
            401,
            'Please provide email password and username!',
        )
    }
    const admin = await Admin.find({
        $or:[
            {username},
            {email}
        ]
    })
    if(!admin){
        throw new customApiError(
            401,
            'Unable to find the user'
        )
    }
    const isPasswordCorrect = admin.isPasswordCorrect()
    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(admin?._id)
    const loggedInAdmin = await Admin.findById(admin?._id).select('-password')
    if(!loggedInAdmin){
        throw new CustomApiError(
            501,
            'Unable to log in at this time please try again'
        )
    }
    return res.status(200).cookie('refreshToken',refreshToken,options).cookie('accessToken',accessToken,options).json(
        new customApiResponse(
            200,
            'Admin Logged In Successfully!',
           {
            
            admin:loggedInAdmin,accessToken,refreshToken

           }
        )
    )
})



const LogoutAdmin = asyncHandlers(async(req,res)=>{
    await Admin.findByIdAndUpdate(req?._id,{
        $set:{
            refreshToken:null
        }
    },
{
    new:true
})
return res.status(200).clearCookie('refreshToken',refreshToken).clearCookie('accessToken',accessToken).
json(
    new customApiResponse(
        200,
        'Logged Out Successfully!'
    )
)
})


const ChangeAdminPassword = asyncHandlers(async(req,res)=>{
    const {oldPassword,newPassword,confirmPassword} = req.body
    const {adminId} = req.user?._id
    const admin  = await Admin.findById(adminId)
    if(!admin){
        throw new customApiError(
            401,
            `There is no such admin with ${adminId}`
        )
    }
    const isPasswordCorrect = await isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new customApiError(
            401,
            'Unauthorized request incorrect password combination'
        )
    }
    if(newPassword!==confirmPassword){
        throw new CustomApiError(
            402,
            `New password does not matches with  confirmed password please enter the valid password!`
               )
    }
    
    admin.password == newPassword
    await admin.save({validateBeforeSave:true})
    return res.status(200).json(
        new customApiResponse(
            200,
            'Password Changed Successfully!'
        )
    )
})


const ChangeAdminUsername = asyncHandlers(async(req,res)=>{
    const { new_username }=req.body
    const { adminId } = req.user?._id
    const admin = await Admin.findById(adminId)
    if(!admin){
        throw new customApiError(
            401,
            `There is no such admin with the id :${adminId}`
        )
    }
    const checkUsernameAvailability = await Admin.find(new_username)
    if(checkUsernameAvailability){
        throw new customApiError(
            402,
            'Username already taken!'
        )
    }
    admin.username == new_username
    await admin.save({validateBeforeSave:true})
    return res.status(200).json(
        new customApiResponse(
            200,
            `username changed successfully!`
        )
    )
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
ChangeAdminPassword,
generateAccessTokenAndRefreshToken
}