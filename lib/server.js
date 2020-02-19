'use strict';

const express = require('express');

const cors = require('cors');

const morgan  = require('morgan');

const route = require('../routes/jordan-tourism-api.js');

const server = express();

const notFoundHandler = require('./middleware/error404.js');

const errorHandler = require('./middleware/error500.js');

server.use(express.json());
server.use(cors());
server.use(morgan('dev'));
server.use(express.static('./public'));
server.use(route)
server.use('*',notFoundHandler);
server.use(errorHandler);


module.exports = {
    app:server,
    start:port=>{
        let PORT = port || process.env.PORT||3000
        server.listen(PORT,()=>{
            console.log(`hi listen in ${PORT}`)
        })
    }
}