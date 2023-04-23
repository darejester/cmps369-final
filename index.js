//main

//geocoder
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

//express
const express = require('express');
//parses json requests
const bodyParser = require('body-parser');

const Database = require('./db');
const db = new Database();
db.initialize();

const app = express();
app.set('view engine', 'pug');
//uses a middleware
app.use(express.static('public'));
app.use(bodyParser.json());

app.use((req, res, next) => {
    req.db = db;
    next();
});


app.use('/places', require('./routes/places'));
app.use('/', (req, res) => {
    res.render('places', {});
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})