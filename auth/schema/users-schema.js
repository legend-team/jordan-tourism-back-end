'use strict ';


/**
 * DEPENDENCIES
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * The user schema that contain what required from the user to insert when sign up or sign in 
 */
const User = mongoose.Schema({
    name: { type: String, required: true },
    pass: { type: String, required: true },
    email: { type: String },
    role: { type: String, default: 'user', enum: ['user', 'admin'] }
});

/**
 * A method related to the User schema that takes the user info when sign up,
 *  hash the password then save the data to the database
 */
User.pre('save', async function () {
    try {
        this.pass = await bcrypt.hash(this.pass, 5);
    }
    catch (e) {
        return Promise.reject();
    }


})


/**
 * A method related to the User schema that takes the user info when sign in,
 *  search on it in the database based on the username, if it exist the method 
 * will compare the hased password in the database with the entered one,
 *  if they are the same the method will return the user info that saved in the database
 */
User.statics.authenticateUser = async function (user, pass) {
    console.log('user', user)
    let foundUser = await this.findOne({ name: user });
    if (foundUser) {
        console.log('foundUser.pass', foundUser.pass)
        console.log('this.pass', pass)
        let valid = bcrypt.compare(pass, foundUser.pass);
        return valid ? foundUser : Promise.reject();
    } else {
        Promise.reject();

    }
}

/**
 * A method related to the User schema to connect the token with the secret so it will keep the user signed in 
 */

User.statics.bearerAuth = async function (token) {
    try {
        let tokenObj = jwt.verify(token, 'ser123');
        if (tokenObj) {
            return Promise.resolve(tokenObj);
        } else {
            return Promise.reject();
        }
    } catch (err) {
        return Promise.reject();
    }
}


/**
 * A method related to the User schema that takes the user role and copmare what the user want to do with the 
 * cabapilities of each role to give the user permission to do what they want to do 
 */
User.statics.capabilityChecker = (capability, role) => {
    let admin = ['read', 'create', 'update', 'delete', 'review'];
    let user = ['read', 'review'];

    if (role === 'admin') {
        for (let i = 0; i < admin.length; i++) {
            if (admin[i] === capability) {
                return true;
            }
        }
    }
    if (role === 'user') {
        for (let i = 0; i < user.length; i++) {
            if (user[i] === capability) {
                return true;
            }
        }
    }
};

module.exports = mongoose.model('User', User);