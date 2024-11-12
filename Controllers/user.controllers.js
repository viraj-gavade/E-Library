const User = require('../Models/user.models')
const Book = require('../Models/book.models')
const asyncHandlers = require('../utils/asyncHandler')
const CustomApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')
const uploadFile = require('../utils/cloudinary')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
  // Define cookie options
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    // secure: true, // Set to true in production
    // sameSite: 'Strict'
    path:'/'
  };

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

const logoutUser = asyncHandlers(async(req,res)=>{
 return res.status(200).clearCookie('refreshToken',options).clearCookie('accessToken',options).redirect('signup')
})



const refreshAccessTokenandRefreshToken = asyncHandlers(async(req,res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new CustomApiError(
            401,
            'Unauthorized Request!'
        )
    }
    const decodedToken =  await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRETE)
     const user = await User.findById(decodedToken._id)
     if(!user){
        throw new CustomApiError(
            403,
            'Invalid refresh token'
        )
     }
     if(incomingRefreshToken!==user.refreshToken){
        throw new CustomApiError(
            401,
            'Refersh token is invalid or used!'
        )
     }

     const { refreshToken , accessToken } = await generateAccessTokenAndRefreshToken(user?._id)

     return res.status(200).cookie('accessToken',refreshToken).cookie('refreshToken',accessToken).json(
        new customApiResponse(
            200,
            'Token refreshed successfully!',
            {
                accessToken:accessToken,
                refreshToken:refreshToken
            }
        )
     )

})


const changeUserPassword = asyncHandlers(async(req,res)=>{
    try {
        const {old_password,new_password,confirm_password} = req.body
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
        return res.status(200).json(
            new customApiResponse(
                200,
                'Password Changed successfully!'
            )
        )
    } catch (error) {
        console.log(error)
    }
})


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
return res.status(200).json(
    new customApiResponse(
        200,
        'Profile picture updated successfully!',
        user
    )
)

})


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
    return res.status(200).json(
        new customApiResponse(
            200,
            'Email changed successfully!'
        )
    )

})

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
    return res.status(200).json(
        new customApiResponse(
            200,
            'Username changed successfully',
            user.username
        )
    )
})


const getuserprofile = asyncHandlers(async(req,res)=>{
    const userId = req.user._id

    if(!userId){
        throw new CustomApiError(
            401,
            'There is no such user with this id'
        )
    }
    const user = await User.findById(userId)
    return res.status(200).json(
        new customApiResponse(
            200,
            'User feteched Successfully!',
            user
        )
    )
})

const getUserAllBooks = asyncHandlers(async(req,res)=>{
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
    if(!books){
        throw new CustomApiError(
            200,'User not found!'
        )
    }

    return res.status(200).render('Mybooks',{
        books:books
    })
})

const getUserDownloads = asyncHandlers(async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Validate that userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new CustomApiError(400, 'Invalid user ID format');
        }

        const books = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)  // Correcting usage of ObjectId
                }
            },
            {
                $lookup: {
                    from: "downloads",
                    localField: '_id',  // Assuming you want to match by the user's _id
                    foreignField: 'downloadedBy', // Assuming this is the field in 'downloads' that references the user
                    as: "MyDownloads",
                }
            },
            {
                $addFields: {
                    Downloadcount: { $size: '$MyDownloads' }  // Adding download count field
                }
            }
        ]);

        if (!books.length) {
            throw new CustomApiError(404, 'No downloads found for the user!');
        }

        return res.status(200).json(
            new customApiResponse(
                200,
                'User Downloads fetched successfully',
                {
                    downloads: books[0].MyDownloads,
                    downloadCount: books[0].Downloadcount
                }
            )
        );
    } catch (error) {
        console.error('Error fetching user downloads:', error);
        res.status(error.statusCode || 500).json({
            message: error.message || 'An error occurred while fetching downloads.'
        });
    }
});


const getBookDownloads = asyncHandlers(async (req, res) => {
    const { bookId } = req.params;
    console.log(bookId);
    const books = await Book.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(bookId)
            }
        },
        {
            $lookup: {
                from: "downloads",
                localField: '_id',
                foreignField: 'bookInfo',
                as: "BookDownloads",
            }
        },
        {
            $addFields: {
                Downloadcount: {
                    $size: '$BookDownloads' 
                }
            }
        }
    ]);

    if (!books.length) {  
        throw new CustomApiError(
            404, 
            'Book not found!'  
        );
    }

    return res.status(200).json(
        new customApiResponse(
            200,
            'Books Downloads fetched successfully',
            {
                downloads: books[0].BookDownloads,
                downloadCount: books[0].Downloadcount
            }
        )
    );
});




module.exports ={
    registerUser,  
    loginUser,
    logoutUser,
    refreshAccessTokenandRefreshToken,
    changeUserPassword,
    changeUserProfilePicture,
    changeUserEmail,
    changeUserUsername,
    getuserprofile,
    getUserAllBooks,
    getUserDownloads,
    getBookDownloads
}