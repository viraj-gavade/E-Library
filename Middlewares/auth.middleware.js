const User = require('../Models/user.models')
const jwt = require('jsonwebtoken')
const CustomApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')
const asyncHandlers = require('../utils/asyncHandler')


const verifyJwt = asyncHandlers(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ','')
        if(!token){
           
            return res.redirect('/api/v1/library/user/signup')
        }

        const decodeToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRETE)
        const user = await User.findById(decodeToken?._id).select('-password -refreshToken')
        if(!user){
            throw new CustomApiError(
                401,
                'Inavlid access Token provided!'
            )
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        throw new CustomApiError(
            error.statusCode,
            error.message
        )
    }
})

module.exports = verifyJwt