'use strict ';


/**
 * REQUIRES
 */
const schema = require('../schema/city_schema.js')
const Model = require('../Model.js');


/**
 * a class city implement the methods of model class
 */
class City extends Model{}

module.exports = new City(schema);