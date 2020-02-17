'use strict '


const mongoose = require('mongoose');
require('./city_schema.js');
require('./review_schema.js')


const historicalPlace = mongoose.Schema({
    historical_name:{type:String,required:true},
    image_link :{type:String,required : true},
    brief_info:{type:String,required:true},
    cityName:{type:String,required:true}
}, { toObject: { virtuals: true}, toJSON: { virtuals: true }
});

historicalPlace.virtual('reviews', {
    ref: 'reviewsSchema',
    localField: 'historical_name',
    foreignField: 'siteName',
    justOne: false
})

historicalPlace.pre('findOne', function(){
    console.log('jjjjjjjjjjjjj');
    
    try{
        this.populate('reviews');
    }catch(err){
        console.error(err)
    }
})

module.exports = mongoose.model('historicalPlace',historicalPlace)



