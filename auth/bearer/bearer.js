'use strict ';

const user = require('../schema/users-schema.js');

module.exports = (req, res, next) => {
    console.log('ttttttttttttttttt');

    if (!req.headers.authorization) {
        next('invalid log in');
    } 
        let token = req.headers.authorization.split(' ').pop();
        console.log('token', token);

    
    user.bearerAuth(token)


    // console.log('uuuuuuuuuuuuu', token)

        .then(validUser => {
            console.log('eeeeeeeeeeeeeeeeeeeee', validUser);

            req.user = validUser;
            next();
        }).catch(err => next(err));


}