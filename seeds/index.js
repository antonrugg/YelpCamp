const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
//requiring what we need to start

mongoose.connect('mongodb://localhost:27017/yelp-camp');
//we connect to localhost standard mongodb port for now (in development)


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});
//logic to connect to db, check if there is any errors, if not will print out db connected


const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
       const camp = new Campground({
           location: `${cities[random1000].city}, ${cities[random1000].state}`,
           title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}
//removing everything from db just to check if we are correctly connected, then we create a campground
//logic to create random title and location using cities.js and seedHelpers.js for every campground we want to seed on db

seedDB().then(() => {
    mongoose.connection.close();
});
//closing connection after we seed the db