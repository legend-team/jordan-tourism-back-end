'use strict';

/**
 * DEPENDENCIES
 */
const express = require('express');
const cors = require('cors');
const morgan  = require('morgan');
const route = require('../routes/jordan-tourism-api.js');

const server = express();

/**
 * REQUIRES
 */
const notFoundHandler = require('./middleware/error404.js');
const errorHandler = require('./middleware/error500.js');

server.use(express.json());
server.use(cors());
server.use(express.static('./public'));
server.use(morgan('dev'));

server.use(route)
server.use('*',notFoundHandler);
server.use(errorHandler);


/**
 * Running the port
 */
module.exports = {
    app:server,
    start:port=>{
        let PORT = process.env.PORT || 3300
        server.listen(PORT,()=>{
            console.log(`hi listen in ${PORT}`)
        })
    }
}