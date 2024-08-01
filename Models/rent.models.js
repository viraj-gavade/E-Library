const mongoose = require('mongoose')

const RentBookSchema = new mongoose.Schema({
    acquiredBy : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    acquiredAt:{
        type:String,
        acquiredate:Date
    }
},{timestamps:true})

module.exports = mongoose.model('Rent',RentBookSchema)