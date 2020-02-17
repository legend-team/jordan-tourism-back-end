'use strict ';

const users = require('../schema/users-schema.js');

module.exports = (capability) => {
    // console.log('cabab', capability);
    
    return (req, res, next) => {
        // console.log('ttttttttttt');
        
        // console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', req.user.role);
        try {
            if(users.capabilityChecker(capability, req.user.role)){
                
                next();
            } else {
                next('U have no permission');
            }

        }
         catch(err){
            next(err)
        }
    }
}