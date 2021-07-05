'use strict'
const mongoose = require('mongoose');


const historical_place = mongoose.Schema({
    historical_name:{type:String,required:true},
    image_link :{type:String,required : true},
    brief_info:{type:String,required:true},
    name:{type:String,required:true}

})



module.exports = mongoose.model('historical_place',historical_place)