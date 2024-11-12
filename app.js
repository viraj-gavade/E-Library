// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Book = require('./Models/book.models')
const connectDB = require('./DataBase/connection');
const HealthcheckRouter = require('./Routes/healthcheck.routers');
const BookRouter = require('./Routes/books.router');
const UserRouter = require('./Routes/users.routers');
const OauthRouter = require('./Routes/Oauth2.router');
const verifyJwt = require('./Middlewares/auth.middleware');
const path = require('path');

// Initialize app
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://127.0.0.1:5500', 
  credentials: true, 
};
app.use(cors(corsOptions));

// Middleware setup
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Session middleware
app.use(session({
  secret: process.env.SECRETE,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use('/', HealthcheckRouter);
app.use('/api/v1/library', BookRouter);
app.use('/api/v1/library/user', UserRouter);
app.use('/', OauthRouter);

// Protected route example
app.use('/home',  async (req, res) => {
  try {
    const books = await Book.find({}).sort('title');
    if (books.length < 1) {
      return res.status(200).json({ message: 'No books found!' });
    }
    res.render('home', { books, user: req.user });
  } catch (error) {
    console.log(error);
  }
});

// Start server and connect to database
const port = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(port, () => {
    console.log('Server is listening on port:', port);
  });
}).catch(error => console.log('Database connection error:', error));
