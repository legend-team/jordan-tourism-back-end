'use strict ';


/**
 * REQUIRES
 */
const schema = require('../schema/review_schema.js')

const Model = require('../Model.js');

/**
 * a class Reviews implement the methods of model class
 */
class Reviews extends Model {}
  

module.exports = new Reviews(schema)