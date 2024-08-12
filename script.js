const express = require('express');
const http = require('http');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { database, storage } = require('./config/firebase');
const { ref, set, push,remove } = require('firebase/database');
const { ref: storageRef, uploadBytes, getDownloadURL } = require('firebase/storage');

const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const contactRoutes = require('./routes/contact');
const loginRoute = require('./routes/login');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use('/admin', adminRoutes);
app.use('/', loginRoute);
app.use('/allproducts', productRoutes);
app.use('/contact', contactRoutes);

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    const featuredItems = require('./data/featured.json');
    const reviews = require('./data/reviews.json');
    res.render('index', { featuredItems, reviews });
});

app.get("/about", (req, res) => {
  res.render('about');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/faq', (req, res) => {
    res.render('faq');
});

server.listen(PORT, (err) => {
    if (err) {
        console.error(`Error starting server on port ${PORT}`, err);
    } else {
        console.log(`Server running on port ${PORT}`);
    }
});