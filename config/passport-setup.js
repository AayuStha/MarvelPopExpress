const passport = require('passport');
const { firebase, auth } = require('./config/firebase');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Use passport with Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACKURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // You can directly use Firebase Auth or save the user data to your Firebase Realtime Database
      await auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(accessToken));

      // You can also manually save user data to Realtime Database or Firestore
      const userRef = db.ref('users/' + profile.id);
      await userRef.set({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        photoUrl: profile.photos[0].value
      });

      done(null, profile);
    } catch (error) {
      console.error('Error authenticating user:', error);
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
