'use strict ';


const express = require('express')
const jwt =require('jsonwebtoken');
const joTourism = require('express').Router();
const historical = require('../models/classes/hist_model.js');
const city = require('../models/classes/city_model.js');
const User = require('../auth/schema/users-schema.js')
const bearerAuth = require('../auth/bearer/bearer.js');
const acl = require('../auth/acl/acl.js');

const basicMiddleware = require('../auth/basic/basic.js');



function dynamicModel(req, res, next) {
    let cities = ['ajloun', 'irbed', 'jarash','amman','zarqa','alkarak','alsalt']

    let model = req.params.model;
    for (let i = 0; i < cities.length; i++) {
        console.log('eeeeeeeeeee', model);
        if (model === cities[i]) {
            req.model = city;
            next();
            return;
        }
    }
    next('invalid route')

}


function dynamicSites(req, res, next) {

    let sites = ['ummqais', 'southerntheate', 'bella', 'streetcolumns' , 'nymphsway', 'artemis','kerakmoabcastle','َkarakcastl']

    let hist = req.params.hist;
    for (let i = 0; i < sites.length; i++) {
        // console.log('eeeeeeeeeee', hist);
        if (hist === sites[i]) {
            req.hist = historical;
            next();
            return;
        }
    }
    next('invalid route')
    
}

joTourism.param('model', dynamicModel)
joTourism.param('hist', dynamicSites)
joTourism.use(express.static('/public'));



joTourism.get('/', bearerAuth, acl('read'), getHitsPlaceAtAll) //// all citeis w/o virtuals
// joTourism.get('/site', getHitsSiteAtAll) //// all sites

joTourism.get('/:model/:id',  bearerAuth, acl('read'), getHitsPlace) /// one city with sites for all
joTourism.get('/:model/:id/:hist/:id',  bearerAuth, acl('read'), getHitsSite) // one site for all

joTourism.post('/', bearerAuth, acl('create') ,postHistPlaces) /// add a city for admin
joTourism.post('/site', bearerAuth, acl('create') , postHistSite) /// add a site for admin

joTourism.put('/:id', bearerAuth, acl('update'),updateHitsPlace) // update a city for admin
joTourism.put('/site/:id', bearerAuth, acl('update'), updateHitsSite) // update a site for admin

joTourism.delete('/:id',  bearerAuth, acl('delete'), deleteHitsPlace) // delete a city for admin
joTourism.delete('/site/:id',  bearerAuth, acl('delete'), deleteHitsSite) // delete a site for admin

// signin /signup routes:
joTourism.post('/signup',signup);
joTourism.post('/signin',basicMiddleware,signin);

joTourism.get('/user', bearerAuth, (req,res) => {
    // console.log('rrrr', req.user);    
    res.status(200).json(req.user);
})

// joTourism.get('/create', bearerAuth, acl('create'), (req, res) => {
//     res.status(200).send('U can create');
//     // res.status(200).redirect('/')
// })

// joTourism.get('/update', bearerAuth, acl('update'), (req, res) => {
//     res.status(200).send('U can update');
//     // res.status(200).redirect('/index.html')

// })

// joTourism.get('/delete', bearerAuth, acl('delete'), (req, res) => {
//     res.status(200).send('U can delete');
// })

// joTourism.get('/read', bearerAuth, acl('read'), (req, res) => {
//     res.status(200).send('U can read');
// })

// signin /signup functions:
function signup(req,res,next){
let user = new User(req.body);    
user.save()
.then((dbuser)=>{
    console.log('hashedpass inside sign up',dbuser.pass)
    let user = {
    id: dbuser._id,
    }
    return jwt.sign(user,'ser123') 
})
.then((token)=>{
console.log('sign-up token :',token);
res.status(200).send('successfully sign-up ')
})
}
function signin (req,res,next){
    console.log(req.token);
    res.status(200).send('successfully sign-in');

}


//CRUD functions
function getHitsPlaceAtAll(req, res, next) {
    city.get()
        .then(output => {
            res.status(200).json(output)
        }).catch()
}

// function getHitsSiteAtAll(req, res, next) {
//     historical.get()
//         .then(output => {
//             res.status(200).json(output)
//         }).catch()
// }

function getHitsPlace(req, res, next) {
    console.log('rrrrrr', req.model);

    city.get(req.params.id)
        .then(output => {
            res.status(200).json(output)
        }).catch(next)
}

function getHitsSite(req, res, next) {
    historical.get(req.params.id)
        .then(output => {
            res.status(200).json(output)
        })
        .catch(e => console.error(e));

}


function postHistPlaces(req, res, next) {
    city.create(req.body)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(next)
}

function postHistSite(req, res, next) {
    historical.create(req.body)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(next)
}

function updateHitsPlace(req, res, next) {
    city.update(req.params.id, req.body)
        .then(data => {
            res.status(200).json(data)
        }).catch(next);
}

function updateHitsSite(req, res, next) {
    historical.update(req.params.id, req.body)
        .then(data => {
            res.status(200).json(data)
        }).catch(next);
}

function deleteHitsPlace(req, res, next) {
    let message = 'deleted';
    city.delete(req.params.id)
        .then(() => {
            res.status(200).json(message)
        }).catch(next);
}

function deleteHitsSite(req, res, next) {
    let message = 'deleted';
    historical.delete(req.params.id)
        .then(() => {
            res.status(200).json(message)
        }).catch(next);
}


module.exports = joTourism;
