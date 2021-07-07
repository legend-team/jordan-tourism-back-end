'use strict ';

/**
 * DEPENDENCIES
 */
const mongoose = require('mongoose');

/**
 * REQUIRES
 */
require('./city_schema.js');
require('./review_schema.js')


/**
 * The historicalPlace schema that contain what required from the admin to insert when create or update a site  
 */
const historicalPlace = mongoose.Schema({
    historical_name: { type: String, required: true },
    image_link: { type: String, required: true },
    brief_info: { type: String, required: true },
    cityName: { type: String, required: true }
}, {
    toObject: { virtuals: true }, toJSON: { virtuals: true }
});


/**
 * Connecting the historicalPlace schema with the reviews schema so the reviews
 *  schema will render under a property 'reviews' in the historicalPlace schema
 */
historicalPlace.virtual('reviews', {
    ref: 'reviewsSchema',
    localField: 'historical_name',
    foreignField: 'siteName',
    justOne: false
})


/**
 * The two schemas connected throuth the site name in both of them.
 */
historicalPlace.pre('findOne', function () {
    try {
        this.populate('reviews');
    } catch (err) {
        console.error(err)
    }
})

module.exports = mongoose.model('historicalPlace', historicalPlace)



