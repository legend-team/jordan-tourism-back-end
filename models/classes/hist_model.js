'use strict';

const Model = require('../Model.js');

const schema = require('../schema/hist_place_schema.js')

class Historical extends Model {
    constructor(){
        super(schema)
    }
}
module.exports = Historical