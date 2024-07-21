const express = require('express');
const http = require('http');
require('dotenv').config();
const path = require('path');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const featuredItems = require('./data/featured.json');
const reviews = require('./data/reviews.json');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render('index', { featuredItems , reviews});
});

server.listen(PORT, (err) => {
    if (err)
        console.error(`Error starting server on port ${PORT}`, err);
    else 
        console.log(`Server rendered at port ${PORT}`);
});