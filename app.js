const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');

const Campground = require('./models/campground');
//requiring what we need to start and campground model

mongoose.connect('mongodb://localhost:27017/yelp-camp');
//we connect to localhost standard mongodb port for now (in development)


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});
//logic to connect to db, check if there is any errors, if not will print out db connected



const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//setting ejs as view engine, setting views as default path

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));//method override for our put/patch/delete requests
//we need this to parse our request.body with post method

app.get('/', (req, res) => {
    res.render('home')
});
//rendering home view

app.get('/campgrounds', catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds })
}));
//temporary home for all campgrounds, async await, passing campgrounds

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});
//get request for new campground form

app.post('/campgrounds', catchAsync(async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}));
//post request for new campground
//added try and catch for generic error handler

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/show', { campground });
}));
//show details of single campground

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground }); 
}));
//show edit form of single campground

app.put('/campgrounds/:id', catchAsync(async (req, res, next) => {
        const { id } = req.params
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        res.redirect(`/campgrounds/${campground._id}`);
}));
//put request for single update campground

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds');
}));
//delete single campground

app.use((err, req, res, next) => {
    res.send('Oh boy, something went wrong!')
})
//generic error handler


app.listen(3000, () => {
    console.log('serving on port 3000')
})
//setting port 3000 on localhost