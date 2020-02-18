'use strict ';



/**
 * REQUIRES
 */
const users = require('../schema/users-schema.js');



/**
 * A high order function to make sure the user have a permition to do the capability
 * @param {string} capability
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
module.exports = (capability) => {
    return (req, res, next) => {
        try {
            if (users.capabilityChecker(capability, req.user.role)) {
                next();
            } else {
                next('U have no permission');
            }
        }
        catch (err) {
            next(err)
        }
    }
}