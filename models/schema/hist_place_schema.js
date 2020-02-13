'use strict'
const mongoose = require('mongoose');


const historical_place = mongoose.Schema({
    historical_name:{type:String,required:true},
    image_link :{type:String,required : true},
    brief_info:{type:String,required:true},
    name:{type:String,required:true}
}, {toObject: {virtuals: true}, toJSON: {vertuals: true}
})

// historical_place.virtual('historicalPlaces', {
//     ref: 'city',
//     localField: 'historical_name',
//     foreignField: 'name',
//     justOne: false
// })

// historical_place.pre('findOne', function(){
//     try{
//         this.population('historicalPlaces');
//     }catch(err){
//         console.error(err)
//     }
// })

module.exports = mongoose.model('historical_place',historical_place)