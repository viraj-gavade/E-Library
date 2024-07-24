const User = require('../Models/user.models')
const asyncHandlers = require('../utils/asyncHandler')
const CustomApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')
const uploadFile = require('../utils/cloudinary')
const options ={
    httpOnly:true,
     secure:true
}


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
        throw new CustomApiError(
            501,
            'Something went wrong while generating the access and refersh token!'
        )
    }
}

const registerUser = asyncHandlers(async(req,res)=>{
   const { username , password , email } = req.body


//    console.log(req.file)
   if(!username || !password ||!email ){
    throw new CustomApiError(
        401,
        'All fields are necessary please fill all the required fields'
    )
   }

   const ProfilePictureLocalPath = req.file?.path

   if(!ProfilePictureLocalPath){
    throw new CustomApiError(
        401,
        'Unable to find local path of the file'
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
   })

const checkuser = await User.findById(user._id).select('-password -refreshToken')
if(!checkuser){
    throw new CustomApiError(
        501,
        'Unable to create the user please try agian later!'
    )
}

return res.status(200).json(
    new customApiResponse(
        200,
        'User created successfully',
        checkuser
    )
)

})

const loginUser = asyncHandlers(async(req,res)=>{
    const {username,email,password} = req.body
    if(!username || ! email || !password){
        throw new CustomApiError(
            401,
            'All fields must be provided!'
        )
    }
    const user = await User.findOne(
        {
            $or:[
                {username},
                {password}
        ]
        }
    )
    const isPasswordCorrect = user.isPasswordCorrect(password)
    if(!isPasswordCorrect){
        throw new CustomApiError(
            401,
            'Inncorrect username or password please try again later!'
        )
    }
    const {accessToken,refreshToken}= await generateAccessTokenAndRefreshToken(user._id)
    console.log()

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

    return res.status(200).cookie('refreshToken',refreshToken,options).cookie('accessToken',accessToken,options).json(
        new customApiResponse(
            200,
            'User Logged In Successfully!',
           {
            
            user:loggedInUser,accessToken,refreshToken

           }
        )
    )
})

const logoutUser = asyncHandlers(async(req,res)=>{
    await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            refreshToken:null
        }
    },
{
    new:true
})
res.status(200).clearCookie('refreshToken',options).clearCookie('accessToken',options).json(
    new customApiResponse(
        200,
        'User Logged Out Successfully!'
    )
)
})



const refreshAccessTokenandRefreshToken = asyncHandlers(async(req,res)=>{
    res.send('This is  refresh access refersh and access token route!')
})


const changeUserPassword = asyncHandlers(async(req,res)=>{
    try {
        const {old_password,new_password,confirm_password} = req.body
        console.log(old_password)
        const user  = await User.findById(req.user?._id)
        const isPasswordCorrect  = await user.isPasswordCorrect(old_password)
        if(!isPasswordCorrect){
            throw new CustomApiError(
                401,
                'The password you have entered does not the exsting password please check the entered password again!'
            )
        }
        if(!new_password===confirm_password){
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
})
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

module.exports ={
    registerUser,  
    loginUser,
    logoutUser,
    refreshAccessTokenandRefreshToken,
    changeUserPassword,
    changeUserProfilePicture,
}