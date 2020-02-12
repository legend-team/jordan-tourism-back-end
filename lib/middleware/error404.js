'use strict ';

function notFoundHandler(req,res,next){
    res.status(404);
    res.statusMessage = 'Resource not found 404'
    res.json({error:'NOT FOUND '})
}

module.exports = notFoundHandler;