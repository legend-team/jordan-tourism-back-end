'use strict ';


/**
 * A function return NOT FOUNd => 404 error when the route is not exist
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
function notFoundHandler(req,res,next){
    res.status(404);
    res.statusMessage = 'Resource not found 404'
    res.json({error:'NOT FOUND '})
}

module.exports = notFoundHandler;