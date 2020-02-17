'use strict '


const mongoose = require('mongoose');
require('./hist_place_schema.js');


const reviews = mongoose.Schema({
    siteName:{type:String,required:true},
    review:{type:String,required:true},
    
});

module.exports = mongoose.model('reviewsSchema',reviews)
