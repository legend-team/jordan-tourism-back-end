'use strict ';

/**
 * REQUIRES
 */
const user = require('../schema/users-schema.js');


/**
 * Making sure that tha user informantion is exist in req.headers.authorization if not the user have to signup first 
 * If req.headers.authorization is exist making sure from the name and the pass are the same as found in database 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        console.log('')
        next('invalid log in');
    } 
     
    let token = req.headers.authorization.split(' ').pop();
    user.bearerAuth(token)
        .then(validUser => {
            req.user = validUser;
            next();
        }).catch(err => next(err));
}