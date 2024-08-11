const express = require('express');
const contactController = require('../controllers/contactController');
const router = express.Router();

router.get('/', contactController.getContactPage);
router.post('/submit-contact', contactController.submitContactForm);

module.exports = router;