require('dotenv').config();
const express = require('express');
const OauthRouter = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const BOOK = require('../Models/book.models');
const USER = require('../Models/user.models');
const JWT = require('jsonwebtoken')

// Google OAuth strategy configuration
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  }, (accessToken, refreshToken, profile, done) => {
      console.log(accessToken)
    // Proceed with profile
    return done(null, profile);
  })
);

// Serialize user info into session
passport.serializeUser((user, done) => {
  console.log('Serialize User:', user);
  done(null, user);
});

// Deserialize user info from session
passport.deserializeUser((user, done) => {
  console.log('Deserialize User:', user);
  done(null, user);
});

// Initiate Google OAuth flow
OauthRouter.get('/auth/google', (req, res, next) => {
  console.log('Initiating Google OAuth flow');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
OauthRouter.get('/auth/google/callback',async (req, res, next) => {
  console.log('Google OAuth callback triggered');
  next();
}, passport.authenticate('google', { failureRedirect: '/' }),
  async(req, res) => {
    console.log('Google OAuth Success - Redirecting to Profile');
    console.log('Logged In User Profile:', req.user); // Log profile after successful authentication
    
    const fullName = req.user.displayName; // Extract the user's display name
    const Useremail = req.user._json.email; // Extract the user's email

    console.log(`Name: ${fullName}`); // Log the user's name
    console.log(`Email: ${Useremail}`); // Log the user's email

    const Existing_User = await USER.findOne({email:Useremail})
    console.log(Existing_User)
    if(!Existing_User){
      const user = await USER.create({
        username:fullName,
        password:"Auth2-Login",
        email:Useremail,
        profileImg:"No Image"
    })
     console.log(user)
     const paylod = {
      _id:user._id,
  }

  const token = JWT.sign(paylod,process.env.JWT_SECRETE,{
      expiresIn:process.env.JWT_EXPIRY
  })
     console.log(token)
     return res.cookie('token', token).redirect('/api/v1/blog/allBlogs');
    
    }
    
    const paylod = {
      _id:Existing_User._id,
      
  }

  const token = JWT.sign(paylod,process.env.JWT_SECRETE,{
      expiresIn:process.env.JWT_EXPIRY
  })
    console.log(token)
    return res.cookie('token', token).redirect('/api/v1/blog/allBlogs');
  }
);

// Debug route
OauthRouter.get('/signin', (req, res) => {
  res.send("Debug Statement");
});

// Protected profile route
OauthRouter.get('/profile', async (req, res) => {
  if (req.isAuthenticated()) {
    console.log('User is authenticated, rendering profile');
    console.log('Authenticated User Profile:', req.user); // Log user profile info
    res.render('home', {
      user: req.user,
    });
  } else {
    console.log('User is not authenticated, redirecting to home');
    res.redirect('/');
  }
});

module.exports = OauthRouter;