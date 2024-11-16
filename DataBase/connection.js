const mongoose = require('mongoose')

/**
 * Establishes connection to MongoDB database
 * 
 * @param {string} url - MongoDB connection string URL
 * @returns {Promise<mongoose.Connection>} Mongoose connection object
 * 
 * Configuration options:
 * - useNewUrlParser: Enables new URL string parser
 * - useUnifiedTopology: Enables new Server Discovery and Monitoring engine
 * 
 * Note: The following options are deprecated in newer Mongoose versions:
 * - useCreateIndex
 * - useFindAndModify
 * 
 * @throws {Error} Exits process with code 1 if connection fails
 */
const connectDB =  (url)=>{
    try {
      return mongoose.connect(url,{
        useNewUrlParser: true,
        // useCreateIndex: true,        // Deprecated in Mongoose 6
        // useFindAndModify: false,     // Deprecated in Mongoose 6
        useUnifiedTopology: true,
      }
       )
        
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB