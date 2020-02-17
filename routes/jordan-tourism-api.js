'use strict ';
/***********************************************************************************************************************/
/***********************************************************************************************************************/

/**
 * DE
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const joTourism = require('express').Router();


const acl = require('../auth/acl/acl.js');
const User = require('../auth/schema/users-schema.js');
const bearerAuth = require('../auth/bearer/bearer.js');
const city = require('../models/classes/city_model.js');
const basicMiddleware = require('../auth/basic/basic.js');
const review = require('../models/classes/review_class.js');
const historical = require('../models/classes/hist_model.js');


/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
function dynamicCeties(req, res, next) {
    let cities = ['ajloun', 'irbed', 'jarash', 'amman', 'zarqa', 'alkarak', 'alsalt']

    let city = req.params.city;
    for (let i = 0; i < cities.length; i++) {
        // console.log('eeeeeeeeeee', model);
        if (city === cities[i]) {
            req.city = city;
            next();
            return;
        }
    }
    next('invalid route')

}

/**
 * dynamicSites function : 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
function dynamicSites(req, res, next) {

    let sites = ['ummqais', 'southerntheate', 'bella', 'streetcolumns', 'nymphsway', 'artemis', 'kerakmoabcastle', 'َkarakcastl']

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


/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
function getModel(req, res, next) {
    let model = req.params.model; // dynamic model
    switch (model) {
        case 'cities':
            req.model = city;
            next();
            return;
        case 'sites':
            req.model = historical;
            // products and categories come from the requires up above
            next();
            return;
        case 'reviews':
            req.model = review;
            next();
            return;
        default:
            next('model not found'); // if we pass smth in the next, if u wrote ur error middleware correctly, it moves it to the error hanling 
            return;
    }
}


joTourism.param('model', getModel)
joTourism.param('city', dynamicCeties)
joTourism.param('hist', dynamicSites)
joTourism.use(express.static('/public'));



joTourism.get('/:model', getHitsPlaceAtAll) //// all citeis w/o virtuals
joTourism.get('/:model', getHitsPlaceAtAll) //// all sites


joTourism.get('/:model/:city/:id', getHitsPlace) /// one city with sites for all
joTourism.get('/:model/:city/:id/:hist/:id', getHitsPlace) // one site for all``


joTourism.post('/:model', bearerAuth, acl('create'), postHistPlaces) /// add a city for admin
joTourism.post('/:model', bearerAuth, acl('create'), postHistPlaces) /// add a site for admin
joTourism.post('/:model', bearerAuth, acl('review'), postHistPlaces) /// add a review for admin and user


joTourism.put('/:model/:id', bearerAuth, acl('update'), updateHitsPlace) // update a city for admin
joTourism.put('/:model/:id', bearerAuth, acl('update'), updateHitsPlace) // update a site for admin


joTourism.delete('/:model/:id', bearerAuth, acl('delete'), deleteHitsPlace) // delete a city for admin
joTourism.delete('/:model/:id', bearerAuth, acl('delete'), deleteHitsPlace) // delete a site for admin


// signin /signup routes:
joTourism.post('/signup', signup);
joTourism.post('/signin', basicMiddleware, signin);
joTourism.get('/user', bearerAuth, (req, res) => {
    res.status(200).json(req.user);
})



// signin /signup functions:
function signup(req, res, next) {
    let user = new User(req.body);
    user.save()
        .then((dbuser) => {
            console.log('hashedpass inside sign up', dbuser.pass)
            let user = {
                id: dbuser._id,
            }
            return jwt.sign(user, 'ser123')
        })
        .then((token) => {
            console.log('sign-up token :', token);
            res.status(200).send('successfully sign-up ')
        })
}



function signin(req, res, next) {
    console.log(req.token);
    // res.status(200).send('successfully sign-in, your token is:  ')
    res.status(200).json(req.token)

}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */




//CRUD functions
function getHitsPlaceAtAll(req, res, next) {
    req.model.get()
        .then(output => {
            res.status(200).json(output)
        }).catch()
}


function getHitsPlace(req, res, next) {
    console.log('rrrrrr', req.model);

    req.model.get(req.params.id)
        .then(output => {
            res.status(200).json(output)
        }).catch(next)
}


function postHistPlaces(req, res, next) {
    req.model.create(req.body)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(next)
}


function updateHitsPlace(req, res, next) {
    req.model.update(req.params.id, req.body)
        .then(data => {
            res.status(200).json(data)
        }).catch(next);
}


function deleteHitsPlace(req, res, next) {
    let message = 'deleted';
    req.model.delete(req.params.id)
        .then(() => {
            res.status(200).json(message)
        }).catch(next);
}

module.exports = joTourism;
