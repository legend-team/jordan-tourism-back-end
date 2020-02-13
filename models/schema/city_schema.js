'use strict';
const mongoose = require('mongoose');


const city = mongoose.Schema({
    name:{type:String,required:true},
    image_url :{type:String,required : true},
    description:{type:String,required:true}
})
// ,{ toObject: {virtuals: true}, toJSON: {virtuals: true}}

// city.virtual('cities', {
//     ref :'historical_place',
//     localField : 'name',//in city shema
//     foreignField: 'historical_name',// in hist schema
//     justOne: false
// })

// city.pre('findOne', function(){
//     try{
//         this.populate('cities');
//     }catch(error){
//         console.error(error)
//     };
    
// })
module.exports =  mongoose.model('city',city)
