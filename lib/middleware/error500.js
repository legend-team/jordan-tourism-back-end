'use strict ';
/**
 * A function return Server Error => 500 error when there is an error
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
function errorHandler(err,req,res,next){
    console.log('req',req.query);

    res.status(500);
    res.statusMessage = 'Server Error';
    res.json({error: err })
}

module.exports=errorHandler;