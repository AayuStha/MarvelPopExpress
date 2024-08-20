const express = require('express');
const http = require('http');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() });
const passport = require('passport');
const session = require('express-session');
const { database, ref } = require('./config/firebase');
const { set } = require('firebase/database');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { refreshAccessToken } = require('./config/passport-setup');

const isProduction = process.env.NODE_ENV === 'production';
const callbackURL = isProduction ? process.env.CALLBACK_URL_PROD : process.env.CALLBACK_URL_DEV;

// Passport configuration for Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    scope: ['profile', 'email']
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
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

const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const contactRoutes = require('./routes/contact');
const loginRoute = require('./routes/login');

// Configure multer
const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10 MB
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(upload.array());  // for parsing multipart/form-data

// Configure session middleware to use the default MemoryStore
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: isProduction }  // Set to true in production for HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/admin', adminRoutes);
app.use('/', loginRoute);
app.use('/allproducts', productRoutes);
app.use('/contact', contactRoutes);

app.get("/", (req, res) => {
    const featuredItems = require('./data/featured.json');
    const reviews = require('./data/reviews.json');
    res.render('index', { featuredItems, reviews });
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login?error=authFailed' }),
    (req, res) => {
      console.log('Google authentication successful. Redirecting to /dashboard.');
      if (req.query.error || !req.user) {
        return res.redirect('/login');
      }
  
      res.render('dashboard', { user: req.user.displayName });
  });

app.get("/login", (req, res) => {
  const error = req.query.error;
  res.render('login', { error: error });

});

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) { 
      res.render('dashboard', { user: req.user.displayName });
  } else {
      res.redirect('/auth/google');
  }
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get('/faq', (req, res) => {
    res.render('faq');
});

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
