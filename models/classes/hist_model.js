'use strict ';

/**
 * REQUIRES
 */
const schema = require('../schema/hist_place_schema.js')
const Model = require('../Model.js');

/**
 * a class Historical implement the methods of model class
 */
class Historical extends Model {}
  

module.exports = new Historical(schema)


