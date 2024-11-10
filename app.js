require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./DataBase/connection')
const HealthcheckRouter = require('./Routes/healthcheck.routers')
const app = express()
const corsOptions = {
  origin: 'http://127.0.0.1:5500', // Your frontend URL
  credentials: true, // Allow cookies and credentials
};
const verifyJwt = require('./Middlewares/auth.middleware')
const Book = require('./Models/book.models')
const {connect} = require('mongoose')
const BookRouter = require('./Routes/books.router')
const UserRouter = require('./Routes/users.routers')
const cookieParser = require('cookie-parser')
const { ChangeStream } = require('mongodb')
const path = require('path')
const { GetAllBooks } = require('./Controllers/book.controllers')
// app.use(express.static()) Static files to be serverd here!
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
//All the main routers 
app.use('/',HealthcheckRouter)
app.use('/api/v1/library',BookRouter)
app.use('/api/v1/library/user',UserRouter)
app.use('/home',verifyJwt, async (req,res)=>{
  try {
    //Add the pagaination functionality
    const book = await Book.find({}).sort('title')
    console.log(book)
    console.log(req.user)
    if(book.length<1){
        return res.status(200).json(
            new customApiResponse(
                200,
                `No books found !`
            )
        )
      }
      res.render('home',{
        books:book,
        user:req.user
      })
  
  } catch (error) {
   console.log(error)
  }
})




const port = process.env.PORT ||5000



//Const DataBase Connection Functionaltiy


const Connectdb = async ()=>{
   try {
  await connectDB(process.env.MONGO_URI)
  console.log('Connected to the database successfully!')
  app.listen(port,()=>{
    console.log('Server is listining on port:',port)
  })
   } catch (error) {
    console.log(error)
   }
}

//Just Checking Victus configuration
Connectdb()

