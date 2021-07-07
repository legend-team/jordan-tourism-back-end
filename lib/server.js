'use strict';

/**
 * DEPENDENCIES
 */
const express = require('express');
const cors = require('cors');
const morgan  = require('morgan');
const server = express();

/**
 * REQUIRES
 */
const route = require('../routes/jordan-tourism-api.js');
const notFoundHandler = require('./middleware/error404.js');
const errorHandler = require('./middleware/error500.js');

server.use(express.json());
server.use(cors());
server.use(morgan('dev'));
server.use('/api/v1',route)
server.use('*',notFoundHandler);
server.use(errorHandler);


/**
 * Running the port
 */
module.exports = {
    app:server,
    start:port=>{
        let PORT = port || process.env.PORT||3100
        server.listen(PORT,()=>{
            console.log(`hi listen in ${PORT}`)
        })
    }
}