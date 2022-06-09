const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
//requiring what we need to start

mongoose.connect('mongodb://localhost:27017/yelp-camp');
//we connect to localhost standard mongodb port for now (in development)


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});
//logic to connect to db, check if there is any errors, if not will print out db connected



const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//setting ejs as view engine, setting views as default path

app.get('/', (req, res) => {
    res.render('home')
})
//rendering home view

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})
//temporary home for all campgrounds, async await, passing campgrounds 


app.listen(3000, () => {
    console.log('serving on port 3000')
})
//setting port 3000 on localhost