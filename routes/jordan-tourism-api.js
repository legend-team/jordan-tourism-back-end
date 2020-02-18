'use strict ';
/***********************************************************************************************************************/
/***********************************************************************************************************************/

/**
 * DEPENDENCIES
 */
const express = require('express');
const jwt = require('jsonwebtoken');

/**
 * REQUIRES
 */
const acl = require('../auth/acl/acl.js');
const joTourism = require('express').Router();
const User = require('../auth/schema/users-schema.js');
const bearerAuth = require('../auth/bearer/bearer.js');
const city = require('../models/classes/city_model.js');
const basicMiddleware = require('../auth/basic/basic.js');
const review = require('../models/classes/review_class.js');
const historical = require('../models/classes/hist_model.js');




/**
 * sign up route => the user should add name and pass 
 * the user not required to add email and role
 * the admin should add the role
 */
joTourism.post('/signup', signup);

/**
 * sign in route => the user should add name and pass
 */
joTourism.post('/signin', basicMiddleware, signin);

/**
 * bearer route to make sure the user is signed in
 */
joTourism.get('/user', bearerAuth, (req, res) => {
    res.status(200).json(req.user);
})

/**
 * Making the city name in the route dynamic
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
 *   Making the site name in the route dynamic
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
 * Dynamic route
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
            next('NOT FOUND'); // if we pass smth in the next, if u wrote ur error middleware correctly, it moves it to the error hanling 
            return;
    }
}

/**
 * Connect the dynamic models with the routes
 */
joTourism.param('model', getModel)
joTourism.param('city', dynamicCeties)
joTourism.param('hist', dynamicSites)


/**
 * show all the cities or all the sites for all visitors
 */
joTourism.get('/:model', getHitsPlaceAtAll) 

/**
 * show one city or one site based on the name of the city and the id for all visitors
 */
joTourism.get('/:model/:city/:id', getHitsPlace)
joTourism.get('/:model/:city/:id/:hist/:id', getHitsPlace) 


/**
 * to post a new city or site by the admin
 */
joTourism.post('/:model', bearerAuth, acl('create'), postHistPlaces) 

/**
 * to post a new review by admin or user
 */
joTourism.post('/:model', bearerAuth, acl('review'), postHistPlaces) 

/**
 * to update a city or site by admin
 */
joTourism.put('/:model/:id', bearerAuth, acl('update'), updateHitsPlace) 


/**
 * to delete city or site by admin
 */
joTourism.delete('/:model/:id', bearerAuth, acl('delete'), deleteHitsPlace) 






/**
 * Signup function
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */

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


/**
 * Sign in function
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
function signin(req, res, next) {
    console.log(req.token);
    // res.status(200).send('successfully sign-in, your token is:  ')
    res.status(200).json(req.token)

}
/**
 * render all the citeis or the sites
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function getHitsPlaceAtAll(req, res, next) {
    req.model.get()
        .then(output => {
            res.status(200).json(output)
        }).catch()
}

/**
 * render a city or a site based on Id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function getHitsPlace(req, res, next) {
    console.log('rrrrrr', req.model);

    req.model.get(req.params.id)
        .then(output => {
            res.status(200).json(output)
        }).catch(next)
}

/**
 * post a city, site or a review
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function postHistPlaces(req, res, next) {
    req.model.create(req.body)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(next)
}

/**
 * update info of  a city or a site based on Id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function updateHitsPlace(req, res, next) {
    req.model.update(req.params.id, req.body)
        .then(data => {
            res.status(200).json(data)
        }).catch(next);
}

/**
 * delete a city or a site based on Id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function deleteHitsPlace(req, res, next) {
    let message = 'deleted';
    req.model.delete(req.params.id)
        .then(() => {
            res.status(200).json(message)
        }).catch(next);
}

module.exports = joTourism;
