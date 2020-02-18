'use strict ';

/**
 * DEPENDENCIES
 */
const mongoose = require('mongoose');

/**
 * REQUIRES
 */
require('./hist_place_schema.js');

/**
 * The reviews schema that contain what required from the user to insert when add a new review 
 */
const reviews = mongoose.Schema({
    siteName: { type: String, required: true },
    review: { type: String, required: true },
});

module.exports = mongoose.model('reviewsSchema', reviews)
