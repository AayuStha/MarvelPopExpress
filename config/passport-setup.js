const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

// Determine if the app is running in production or development
const isProduction = process.env.NODE_ENV === 'production';
const callbackURL = isProduction ? process.env.CALLBACK_URL_PROD : process.env.CALLBACK_URL_DEV;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,  // Use the dynamic callback URL
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // Here, you can handle the Google OAuth response, such as saving user data
      // e.g., save to database or perform other actions with the user's profile
      done(null, profile);
    } catch (error) {
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
