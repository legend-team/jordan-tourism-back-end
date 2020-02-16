'use strict';
const mongoose = require('mongoose');
require('./hist_place_schema.js')


const city = mongoose.Schema({
    name:{type:String,required:true},
    image_url :{type:String,required : true},
    description:{type:String,required:true}
}, { toObject: { virtuals: true }, toJSON: { virtuals: true }});

city.virtual('achistoricalPlaces', {
    ref :'historicalPlace',
    localField : 'name',//in city schema
    foreignField: 'cityName',// in hist schema
    justOne: false
})

city.pre('findOne', function(){
    console.log('8888888888888');
    
    try{
        this.populate('achistoricalPlaces');
    }catch(error){
        console.error(error)
    };
    
});

module.exports =  mongoose.model('city',city)