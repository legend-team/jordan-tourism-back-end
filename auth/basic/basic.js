'use strict ';

const base64 = require('base-64');
const bcryptjs = require('bcryptjs');
const userSchema = require('../schema/users-schema.js');
const jwt =require('jsonwebtoken');




function basicMiddleware(req,res,next){
    console.log('req.headers.authorization :',req.headers.authorization);
    if (!req.headers.authorization){
        next('sign-up first');
        return;
    }

let basicCode = req.headers.authorization.split(' ').pop();

let [name, pass] = base64.decode(basicCode).split(':');
userSchema.authenticateUser(name , pass)
.then(validUser=>{
    console.log('validUser',validUser)
    let user = {
        id: validUser._id,
        username : validUser.name,
        password : validUser.pass,
        role : validUser.role
        }
        console.log('user.id',user.id)
        req.token = jwt.sign(user,'ser123');
        console.log('req.token',req.token);
        next();  
})
.catch(err =>{
    next('Invalid user error',err); 
    // console.error()
})



}
module.exports=basicMiddleware;

// function basicMiddleware(req,res,next){
//     if (!req.headers.authorization){
//         next('sign-up first');
//         return;
//     }
//     console.log('req.headers.authorization :',req.headers.authorization);

// let basicCode = req.headers.authorization.split(' ').pop();
// console.log('basicCode',basicCode);
// // console.log('basicCode',base64.decode(basicCode).split(':') );
// let [name, pass] = base64.decode(basicCode).split(':');
// console.log('[name, pass]',[name, pass])
// let record = {name : name}
// console.log('record',record)
// userSchema.findOne(record)
// .then (user=>{
//     console.log('user:',user)
//     let valid = bcryptjs.compare(pass,user.pass);
//     console.log('user.pass',user.pass,'pass',pass)

//     // console.log('valid',valid)
//     return valid ? user : Promise.reject();  //redirect page "wrong password"
// })
// .then(validUser=>{
//     let user = {
//         id: validUser._id,
//         }
//         console.log('user.id',user.id)
//         req.token = jwt.sign(user,'ser123');
//         console.log('req.token',req.token)
// })
// .catch(err =>{
//     // next('Invalid user error',err);
//     console.error()
// })





// }