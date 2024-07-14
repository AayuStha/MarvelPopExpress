const express = require('express');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT;
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("public"))
const featuredItems = require('./data/featured.json');

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render('index', { featuredItems });
});

app.listen(PORT, (err) => {
    if (err) console.error(`Error starting server on port ${PORT}`, err);
    else console.log(`Server rendered at port ${PORT}`);
});