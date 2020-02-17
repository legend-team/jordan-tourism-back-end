'use strict ';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = mongoose.Schema({
    name: { type: String, required: true },
    pass: { type: String, required: true },
    email: { type: String },
    role: { type: String, default: 'user', enum: ['user', 'admin'] }
});

User.pre('save', async function () {
    try {
        this.pass = await bcrypt.hash(this.pass, 5);
    }
    catch (e) {
        return Promise.reject();
    }


})

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