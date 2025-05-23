const User = require('../Models/user.models')
const Book = require('../Models/book.models')
const asyncHandlers = require('../utils/asyncHandler')
const CustomApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')
const uploadFile = require('../utils/cloudinary')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

/**
 * Configuration object for cookies
 * Sets HTTP-only cookies that expire in 30 days
 * TODO: Enable secure and sameSite options in production
 */
const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    // secure: true, // Set to true in production
    // sameSite: 'Strict'
    path:'/'
};

/**
 * Generates new access and refresh tokens for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object>} Object containing accessToken and refreshToken
 * @throws {CustomApiError} If token generation fails
 */
const generateAccessTokenAndRefreshToken = async(userId)=>{
    try {
        const user =  await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        console.log(accessToken,refreshToken)
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        console.log(error)
        throw new CustomApiError(
            501,
            'Something went wrong while generating the access and refersh token!'
        )
    }
}

/**
 * Handles user registration
 * Validates required fields, uploads profile picture to Cloudinary,
 * checks for existing users, and creates new user record
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const  registerUser = asyncHandlers(async(req,res)=>{
   const { username , password , email ,bio} = req.body

//    console.log(req.file)
   if(!username || !password ||!email ){
    throw new CustomApiError(
        401,
        'All fields are necessary please fill all the required fields'
    )
   }
   console.log(req.file)
   const ProfilePictureLocalPath = req.file?.path

   if(!ProfilePictureLocalPath){
    throw new CustomApiError(
        401,
        'Unable to find local path of the file please check if profile image is selected or not'
    )
   }
   const profileImg = await uploadFile(ProfilePictureLocalPath)

   if(!profileImg.url){
    throw new CustomApiError(
        501,
        'Something went wrong while uploading the file on cloudinary!'
    )
   }

   const exstinguser = await User.findOne({
    $or:[{username},{email}]
   })
   if(exstinguser){
    throw new CustomApiError(
        402,
        'User already exists with this username or email'
    )
   }
   const user = await User.create({
    username:username,
    password:password,
    email:email,
    profileImg:profileImg?.url,
    bio:bio || ''
   })

const checkuser = await User.findById(user._id).select('-password')

return res.render('signin')

})

/**
 * Handles user login
 * Validates credentials, generates tokens, and sets cookies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const loginUser = asyncHandlers(async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!(username || email) || !password) {
        throw new CustomApiError(401, 'All fields must be provided!');
    }

    console.log('Username or Email:', username || email);

    // Find user by username or email
    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        return res.status(401).json(
            new customApiResponse(
                401,
                'User not found with provided credentials!'
            )
        );
    }

    console.log('User Found:', user);

    // Check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return res.status(401).json(
            new customApiResponse(
                401,
                'Incorrect username or password!'
            )
        );
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    console.log('Tokens Generated:', { accessToken, refreshToken });

    // Find logged in user excluding password and refreshToken fields
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    // Respond with user data and tokens
    return res.cookie('accessToken',accessToken).cookie('refreshToken',refreshToken).redirect('/home')
});

/**
 * Handles user logout
 * Clears authentication cookies and redirects to signup page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logoutUser = asyncHandlers(async(req,res)=>{
 return res.status(200).clearCookie('refreshToken',options).clearCookie('accessToken',options).redirect('signup')
})

/**
 * Handles password change
 * Validates old password and confirms new password match
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const changeUserPassword = asyncHandlers(async(req,res)=>{
    try {
        console.log(req.body)
        const {old_password,new_password,confirm_password} = req.body
        console.log(old_password)
        const user  = await User.findById(req.user?._id)
        if(!user){
            throw new CustomApiError(
                401,
                `   There is no such user with the id:-${req.user?._id}`
            )
        }
        const isPasswordCorrect  = await user.isPasswordCorrect(old_password)
        if(!isPasswordCorrect){
            return res.status(401).json( 
                new customApiResponse(
                401,
                'The password you have entered does not the exsting password please check the entered password again!'
            )  
            )
        }
        if(new_password!==confirm_password){
            throw new CustomApiError(
            402,
            `New password does not matches with  confirmed password please enter the valid password!`
               )
        }
      
        user.password = new_password
        await user.save({validateBeforeSave:false})
        return res.status(200).redirect('/api/v1/library/user/profile')
    } catch (error) {
        console.log(error)
    }
})

/**
 * Handles profile picture update
 * Uploads new image to Cloudinary and updates user record
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const changeUserProfilePicture = asyncHandlers(async(req,res)=>{

    const ProfilePictureLocalPath = req.file?.path
    if(!ProfilePictureLocalPath){
        throw new CustomApiError(
            400,
            'Profile picture local path not found make sure you have uploaded your profile picture correctly!'
        )
    }
    const New_Profile_Picture= await uploadFile(ProfilePictureLocalPath)
    if(!New_Profile_Picture?.url){
        throw new CustomApiError(
            500,
            `Something went wrong while uploading the file on cloudinary please try again later!`
        )
    }
    const user = await User.findByIdAndUpdate(req.user?._id,{
        profileImg:New_Profile_Picture?.url || "Unable to get the url of the profile picture!"
    },
{
    new:true
}).select('-password -email -bio -books -createdAt -refreshToken')
if(!user){
    throw new CustomApiError(
        403,
        'Unable to find and upate the profile picture of the user!'
    )
}
return res.status(200).redirect('/api/v1/library/user/profile')

})

/**
 * Handles email update
 * Validates new email and checks for existing users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const changeUserEmail = asyncHandlers(async(req,res)=>{

    const {email} = req.body
    if(!email){
        throw new CustomApiError(
            402,
            'Please provide the email inorder to change the email'
        )
    }
    const existinguser = await User.findOne({email})
    if(existinguser){
        throw new CustomApiError(
            401,
            'User already exists with this email id'
        )
    }
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new CustomApiError(
            401,
            'Unable to get the user id maybe an unauthorized request!'
        )
    }
    user.email=email
    await user.save({validateBeforeSave:false})
    return res.status(200).redirect('/api/v1/library/user/profile')

})

/**
 * Handles username update
 * Validates new username and checks for existing users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const changeUserUsername = asyncHandlers(async(req,res)=>{
    const UserId = req.user?._id
    if(!UserId){
        throw new CustomApiError(
            401,
            ' user id not found! maybe an unauthorized request'
        )
    }
    const {username,confirm_username}=req.body
    if(!username){
        throw new CustomApiError(
            402,
            'Please provide the username to change the username!'
        )
    }

    const existinguser = await User.findOne({username})  
    if(existinguser){
        throw new CustomApiError(
            402,
            'username is already taken please try another username'
        )
    }  
    const user = await User.findById(UserId)
    if(!user){
        throw new CustomApiError(
            402,
            'Unable to find the user please check the user id again!'
        )
    }
    if(username!==confirm_username){
        return res.status(403).json(
            new customApiResponse(
                402,
                'Username does not match with confirm username'
            )
        )
    }
    user.username=username
    await user.save({validateBeforeSave:false})
    return res.status(200).redirect('/api/v1/library/user/profile')
})

/**
 * Retrieves user profile
 * Returns user data for profile page rendering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getuserprofile = asyncHandlers(async(req,res)=>{
    const userId = req.user._id

    if(!userId){
        throw new CustomApiError(
            401,
            'There is no such user with this id'
        )
    }
    const user = await User.findById(userId)
    return res.status(200).render('Profile',{
        user:user
    })
})

/**
 * Retrieves all books uploaded by user
 * Uses MongoDB aggregation to fetch books and calculate counts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserAllBooks = asyncHandlers(async(req,res)=>{
    console.log(req.user)
    const books = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"books",
                localField:'_id',
                foreignField:'uploadedBy',
                as:"MyUploads",
            },
            
        },
        {
            $addFields: {
                Downloadcount: { $size: '$MyUploads' }  // Adding download count field
            }
        }
    ])
     if(books[0].MyUploads.length > 0){
        return res.status(200).render('Mybooks',{
            books:books,
            user:req.user
        })
     }

    return res.status(200).render('Mybooks',{
        books:books,
        user:req.user
    })
})

module.exports ={
    registerUser,  
    loginUser,
    logoutUser,
    changeUserPassword,
    changeUserProfilePicture,
    changeUserEmail,
    changeUserUsername,
    getuserprofile,
    getUserAllBooks,
}