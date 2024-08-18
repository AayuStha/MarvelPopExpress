const passport = require('passport');

// Redirect to Google for authentication
exports.redirectToGoogle = passport.authenticate('google', {
    scope: ['profile', 'email']
});

// Handle the callback from Google after authentication
exports.handleGoogleCallback = [
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to dashboard.
        res.redirect('/dashboard');
    }
];

// Display login page
exports.login = (req, res) => {
    res.render('login');
};

// Display the dashboard page
exports.dashboard = (req, res) => {
    res.render('dashboard');
};
