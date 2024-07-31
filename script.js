const express = require('express');
const http = require('http');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const { database } = require('./src/config/firebase');
const { ref, push } = require('firebase/database');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const featuredItems = require('./data/featured.json');
const reviews = require('./data/reviews.json');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


app.get("/", (req, res) => {
    res.render('index', { featuredItems , reviews});
});

app.get('/contact', (req, res) => {
    res.render('contact', { message: null, error: null });
});

app.post('/submit-contact', (req, res) => {
    const { name, email, subject, enquiryType, message } = req.body;
  
    const contactsRef = ref(database, `contacts/${name}`);
  
    push(contactsRef, {
      name,
      email,
      subject,
      enquiryType,
      message,
    })
    .then(() => {
        res.render('contact', { message: `Thank you ${name}, for your message! We will get back to you soon.`, error: null });
      })
      .catch((error) => {
        console.error("Error saving contact information:", error);
        res.render('contact', { message: null, error: "There was an error submitting your message. Please refresh the page and try again." });
      });
    });


server.listen(PORT, (err) => {
    if (err)
        console.error(`Error starting server on port ${PORT}`, err);
    else 
        console.log(`Server rendered at port ${PORT}`);
});