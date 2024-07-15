const mongoose = require('mongoose')


const connectDB =  (url)=>{
    try {
      return mongoose.connect(url,{
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true,
      }
       )
        
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}



module.exports = connectDB