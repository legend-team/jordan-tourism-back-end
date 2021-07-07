'use strict '


const mongoose = require('mongoose');
require('./city_schema.js');


const historicalPlace = mongoose.Schema({
    historical_name:{type:String,required:true},
    image_link :{type:String,required : true},
    brief_info:{type:String,required:true},
    cityName:{type:String,required:true}
// }, { toObject: { virtuals: true}, toJSON: { virtuals: true }
});

// historicalPlace.virtual('actualCity', {
//     ref: 'city',
//     localField: 'cityName',
//     foreignField: 'name',
//     justOne: false
// })

// historicalPlace.pre('findOne', function(){
//     console.log('jjjjjjjjjjjjj');
    
//     try{
//         this.populate('actualCity');
//     }catch(err){
//         console.error(err)
//     }
// })

module.exports = mongoose.model('historicalPlace',historicalPlace)



