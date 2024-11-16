/**
 * @fileoverview Main Application Server Configuration
 * Sets up Express server with middleware, authentication, database connection,
 * and route handlers for a library management system
 */

// Load environment variables
require('dotenv').config();

// Import required dependencies
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

/**
 * @description Initialize Express application
 */
const app = express();

/**
 * @description CORS Configuration
 * Allows cross-origin requests from development server
 * Enables credentials for authentication
 */
const corsOptions = {
  origin: 'http://127.0.0.1:5500', 
  credentials: true, 
};
app.use(cors(corsOptions));

/**
 * @description Middleware Configuration
 * Sets up request parsing and cookie handling
 */
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/**
 * @description View Engine Configuration
 * Sets up EJS templating engine and views directory
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
console.log('Views directory:', app.get('views'));


/**
 * @description Session Configuration
 * Configures express-session for managing user sessions
 * - Secret: Used to sign the session ID cookie
 * - Resave: Forces session to be saved back to store
 * - SaveUninitialized: Forces a session that is "uninitialized" to be saved
 */
app.use(session({
  secret: process.env.SECRETE,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

/**
 * @description Passport Authentication
 * Initializes passport middleware for authentication
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * @description Route Definitions
 * Mounts different route handlers for API endpoints
 */
app.use('/', HealthcheckRouter);            // Health check endpoints
app.use('/api/v1/library', BookRouter);     // Book management endpoints
app.use('/api/v1/library/user', UserRouter); // User management endpoints
app.use('/', OauthRouter);                  // OAuth authentication endpoints

/**
 * @route GET /home
 * @description Protected home page route
 * @middleware verifyJwt - Ensures user is authenticated
 * @returns {View} Renders home page with books and user data
 */
app.use('/home', verifyJwt, async (req, res) => {
  try {
    const books = await Book.find({}).sort('title');
    if (books.length < 1) {
      return res.render('home', { books, user: req.user });
    }
    res.render('home', { books, user: req.user });
  } catch (error) {
    console.log(error);
  }
});

/**
 * @description Server Initialization
 * Connects to MongoDB and starts the Express server
 * Falls back to port 3000 if PORT environment variable is not set
 */
const port = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(port, () => {
    console.log('Server is listening on port:', port);
  });
}).catch(error => console.log('Database connection error:', error));