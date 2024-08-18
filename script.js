const express = require('express');
const http = require('http');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const passport = require('passport');
const session = require('express-session');
const { database, ref } = require('./config/firebase'); // Import database and ref
const { set } = require('firebase/database'); // Import the set function from firebase/database

const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Passport configuration for Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // Create a reference to the user data in the Realtime Database
      const userRef = ref(database, 'users/' + profile.id);

      // Save user data to Firebase Realtime Database
      await set(userRef, {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        photoUrl: profile.photos[0].value
      });

      done(null, profile);
    } catch (error) {
      console.error('Error saving user to Firebase:', error);
      done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.array());  // for parsing multipart/form-data
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using HTTPS in production
}));
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.get("/", (req, res) => {
    res.render('index');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard'); // Redirect to the dashboard after successful login
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) { 
        res.render('dashboard', { user: req.user.displayName });
    } else {
        res.redirect('/login'); 
    }
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get('/faq', (req, res) => {
    res.render('faq');
});

// HTTP server
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
