const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.login);
router.get('/auth/google', authController.redirectToGoogle);
router.get('/auth/google/callback', authController.handleGoogleCallback);
router.get('/dashboard', authController.dashboard);

module.exports = router;
