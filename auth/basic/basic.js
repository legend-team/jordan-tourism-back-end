'use strict ';

/**
 * DEPENDENCIES
 */
const base64 = require('base-64');
const jwt = require('jsonwebtoken');

/**
 * REQUIRES
 */
const userSchema = require('../schema/users-schema.js');


/**
 * Making sure that tha user informantion is exist in req.headers.authorization if not the user have to signup first 
 * If req.headers.authorization is exist making sure from the name and the pass are the same as found in database 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
function basicMiddleware(req, res, next) {
    console.log('req.headers.authorization :', req.headers.authorization);
    if (!req.headers.authorization) {
        next('sign-up first');
        return;
    }

    let basicCode = req.headers.authorization.split(' ').pop();

    let [name, pass] = base64.decode(basicCode).split(':');
    userSchema.authenticateUser(name, pass)
        .then(validUser => {
            console.log('validUser', validUser)
            let user = {
                id: validUser._id,
                username: validUser.name,
                password: validUser.pass,
                role: validUser.role
            }
            console.log('user.id', user.id)
            req.token = jwt.sign(user, 'ser123');
            console.log('req.token', req.token);
            next();
        })
        .catch(err => {
            next('Invalid user error', err);
        })



}
module.exports = basicMiddleware;
