const { match } = require('assert');
const { kMaxLength } = require('buffer')
const mongoose = require('mongoose')
const { type } = require('os')
const bcryptjs = require('bcryptjs')
const usernameRegex = /^(?!.*[-_]{2,})(?![-_])[A-Za-z0-9_-]{3,20}(?<![-_])$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
const emailRegex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            kMaxLength:16,
            required:[true,'Please provide the username'],
            unique:[true,'Username must be unique'],
            lowercase:true,
            match:[usernameRegex,'Please enter the valid username']

        },
        password:{
            type:String,
            // kMaxLength:16,
            required:[true,'Please provide the username'],
            match:[passwordRegex,'Please enter the valid password combination your password is too weak!']

        },
        email:{
            type:String,
            kMaxLength:16,
            required:[true,'Please provide the username'],
            lowercase:true,
            match:[emailRegex,'Please enter the valid username'],
            unique:true
        },
        profileImg:{
            type:String,
            required:false
        },
        refreshToken:{
            type:String,
        },
        books:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Books"
            }
        ],
       
    },
    {timestamps:true}
)

UserSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        return next()
    }
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password,salt)
    next()
})


UserSchema.methods.isPasswordCorrect = async function(UserPassword){
    const isPasswordCorrect = await bcryptjs.compare(UserPassword,this.password)
    return isPasswordCorrect
}
UserSchema.methods.generateAccessToken = async function() {
    const accessToken = await jwt.sign({
        _id:this._id
    },process.env.ACCESS_TOKEN_SECRETE,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
    return accessToken
}


UserSchema.methods.generateRefreshToken = async function() {
    const accessToken = await jwt.sign({
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRETE,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
    return accessToken
}

module.exports = mongoose.model('User',UserSchema)