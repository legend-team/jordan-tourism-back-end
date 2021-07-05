'use strict';

const server = require('./lib/server.js');

const mongoose = require('mongoose');

const MONGOOSE_URI = 'mongodb://localhost:27017/joTourism'
const mongoose_option = {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    // useFindAndModifiy:false
}
mongoose.connect(MONGOOSE_URI,mongoose_option)
.then(()=>{console.log('i am connected bruh')})
.catch(e =>{console.error(e)})

server.start()