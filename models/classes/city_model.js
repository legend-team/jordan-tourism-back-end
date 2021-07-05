'use strict';

const Model = require('../Model.js');
const schema = require('../schema/city_schema.js')

class City extends Model{
    // constructor(){
    //     super(schema)
    // }
}

module.exports = new City(schema);