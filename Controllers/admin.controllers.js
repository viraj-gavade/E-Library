//MAKE A ADMIN CONTROLLER SUCH THAT ONLY ADMIN IS ABLE TO SEE ALL THE USER DATA AND ADD AND DELETE THE BOOKS

const Admin = require('../Models/admin.models')
const asyncHandlers = require('../utils/asyncHandler')
const uploadFile = require('../utils/cloudinary')
const customApiError = require('../utils/customApiError')
const customApiResponse = require('../utils/customApiResponse')
const jwt = require('jsonwebtoken')
const options ={
    httpOnly:true,
     secure:true
}
