const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const Campground = require('./models/campground');
const { required } = require('joi');
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


const validateCampground = (req, res, next) => {
   
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
//middleware for validation

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

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    
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

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
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

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong!';
    res.status(statusCode).render('error', { err });
})
//generic error handler for express errors
//this will fire with catchAsync function(defined and exported in relative file)
//dont forget about constructor in ExpressError.js


app.listen(3000, () => {
    console.log('serving on port 3000')
})
//setting port 3000 on localhost