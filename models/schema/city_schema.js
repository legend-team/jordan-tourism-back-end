'use strict ';

/**
 * DEPENDENCIES
 */
const mongoose = require('mongoose');

/**
 * REQUIRES
 */
require('./hist_place_schema.js')


/**
 * The city schema that contain what required from the admin to insert when create or update a city  
 */
const city = mongoose.Schema({
    name: { type: String, required: true },
    image_url: { type: String, required: true },
    description: { type: String, required: true }
}, { toObject: { virtuals: true }, toJSON: { virtuals: true } });


/**
 * Connecting the city schema with the hostrical schema so the hostrical
 *  schema will render under a property 'achistoricalPlaces' in the city schema
 */
city.virtual('achistoricalPlaces', {
    ref: 'historicalPlace',
    localField: 'name',//in city schema
    foreignField: 'cityName',// in hist schema
    justOne: false
})

/**
 * The two schemas connected throuth the city name in both of them.
 */

city.pre('findOne', function () {
    try {
        this.populate('achistoricalPlaces');
    } catch (error) {
        console.error(error)
    };
});

module.exports = mongoose.model('city', city)