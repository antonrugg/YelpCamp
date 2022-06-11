const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//shortcut for later calls on mongoose.schema

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});
//defined starting Schema for my Campground

module.exports = mongoose.model('Campground', CampgroundSchema);
//module exporting Campground Model