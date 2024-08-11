const { database } = require('../config/firebase');
const { ref, push } = require('firebase/database');

// Render Contact Page
exports.getContactPage = (req, res) => {
    res.render('contact', { message: null, error: null });
};

// Handle Contact Form Submission
exports.submitContactForm = (req, res) => {
    const { name, email, subject, enquiryType, message } = req.body;
    const contactsRef = ref(database, `contacts/${name}`);

    push(contactsRef, { name, email, subject, enquiryType, message })
    .then(() => {
        res.render('contact', { message: `Thank you ${name}, for your message! We will get back to you soon.`, error: null });
    })
    .catch((error) => {
        console.error("Error saving contact information:", error);
        res.render('contact', { message: null, error: "There was an error submitting your message. Please refresh the page and try again." });
    });
};