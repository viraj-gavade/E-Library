const mongoose = require('mongoose')

const ContactSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide the name']
    },
    email:{
        type:String,
        required:[true,'Please provide the name']
    },
    subject:{
        type:String,
        required:[true,'Please provide the name']
    },
    message:{
        type:String,
        required:[true,'Please provide the name']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model('ContactForm',ContactSchema)