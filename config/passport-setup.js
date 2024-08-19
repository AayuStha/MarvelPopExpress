const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const { database, ref } = require('../config/firebase');
const { set } = require('firebase/database');

// Determine if the app is running in production or development
const isProduction = process.env.NODE_ENV === 'production';
const callbackURL = isProduction ? process.env.CALLBACK_URL_PROD : process.env.CALLBACK_URL_DEV;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    scope: ['profile', 'email']
  },
  async function(accessToken, refreshToken, profile, done) {
    console.log('Google profile:', profile);
    try {
      // Store tokens and user profile in session
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;

      // Save user data to Firebase
      const userRef = ref(database, 'users/' + profile.id);
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

module.exports = passport;
