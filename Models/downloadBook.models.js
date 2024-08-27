const mongoose = require('mongoose')

const DownloadBookSchema = new mongoose.Schema({
    bookInfo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book"
    },
    downloadedBy:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model('Download',DownloadBookSchema)