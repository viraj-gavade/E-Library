const { match } = require('assert');
const { kMaxLength } = require('buffer')
const mongoose = require('mongoose')
const { type } = require('os')
const bcryptjs = require('bcryptjs')

const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            kMaxLength:16,
            required:[true,'Please provide the username'],
            unique:[true,'Username must be unique'],
            lowercase:true,

        },
        password:{
            type:String,
            // kMaxLength:16,
            required:[true,'Please provide the username']

        },
        email:{
            type:String,
            kMaxLength:16,
            required:[true,'Please provide the username'],
            lowercase:true,
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
    return await bcryptjs.compare(UserPassword,this.password)

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
},


module.exports = mongoose.model('User',UserSchema)