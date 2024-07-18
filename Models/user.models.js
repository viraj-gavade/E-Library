const { match } = require('assert');
const { kMaxLength } = require('buffer')
const mongoose = require('mongoose')
const { type } = require('os')

const usernameRegex = /^(?!.*[-_]{2,})(?![-_])[A-Za-z0-9_-]{3,20}(?<![-_])$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
const emailRegex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
            kMaxLength:16,
            required:[true,'Please provide the username'],
            match:[passwordRegex,'Please enter the valid username']

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
        books:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Books"
            }
        ]
    },{timestamps:true}
)


module.exports = mongoose.model('User',UserSchema)