'use strict';
const mongoose = require('mongoose');


const city = mongoose.Schema({
    name:{type:String,required:true},
    image_url :{type:String,required : true},
    description:{type:String,required:true}

    
})

module.exports =  mongoose.model('city',city)
