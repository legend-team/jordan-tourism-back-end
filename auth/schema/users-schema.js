'use strict ';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const User = mongoose.Schema({
    name : {type :String,required:true},
    pass:{type :String,required:true},
    email:{type :String},
});

User.pre('save',async function(){
    try{
        this.pass = await bcrypt.hash(this.pass,5);
        // console.log('this.pass hashed:',this.pass)
    
    }
    catch(e){
        return Promise.reject();
    }
        

})

User.statics.authenticateUser = async function(user , pass){
    console.log('user' , user)
    let foundUser = await this.findOne({name: user});
    if (foundUser){
        console.log('foundUser.pass' , foundUser.pass)
        console.log('this.pass' , pass)
        let valid = bcrypt.compare(pass,foundUser.pass);
        return valid ? foundUser : Promise.reject();
    }
}

module.exports = mongoose.model('User',User);