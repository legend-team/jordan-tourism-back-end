/* eslint-disable new-cap */
/* eslint-disable strict */
'use strict ';

const joTourism = require('express').Router();

const historical = require('../models/classes/hist_model.js');
const city = require('../models/classes/city_model.js');
const User = require('../auth/schema/users-schema.js');
const jwt = require('jsonwebtoken');

const basicMiddleware = require('../auth/basic/basic.js');
const faceOauthMiddleware = require('../auth/oauth/face-oauth-middleware.js');

function dynamicModel(req, res, next) {
  let cities = ['ajloun', 'irbed', 'jarash','amman','zarqa','alkarak','alsalt'];

  let model = req.params.model;
  for (let i = 0; i < cities.length; i++) {
    console.log('eeeeeeeeeee', model);
    if (model === cities[i]) {
      req.model = city;
      next();
      return;
    }
  }
  next('invalid route');

}


function dynamicSites(req, res, next) {

  let sites = ['ummqais', 'southerntheate', 'bella', 'streetcolumns' , 'nymphsway', 'artemis','kerakmoabcastle','َkarakcastl'];

  let hist = req.params.hist;
  for (let i = 0; i < sites.length; i++) {
    // console.log('eeeeeeeeeee', hist);
    if (hist === sites[i]) {
      req.hist = historical;
      next();
      return;
    }
  }
  next('invalid route');

}

joTourism.param('model', dynamicModel);
joTourism.param('hist', dynamicSites);

joTourism.get('/', getHitsPlaceAtAll); //// all citeis w/o virtuals
// joTourism.get('/site', getHitsSiteAtAll) //// all sites

joTourism.get('/:model/:id', getHitsPlace); /// one city with sites
joTourism.get('/:model/:id/:hist/:id', getHitsSite); // one site

// joTourism.post('/', postHistPlaces) /// add a city
// joTourism.post('/site', postHistSite) /// add a site

joTourism.put('/:id', updateHitsPlace); // update a city
joTourism.put('/site/:id', updateHitsSite); // update a site

joTourism.delete('/:id', deleteHitsPlace); // delete a city
joTourism.delete('/site/:id', deleteHitsSite); // delete a site

// signin /signup routes:
joTourism.post('/signup',signup);
joTourism.post('/signin',basicMiddleware,signin);
// joTourism.get('/oauth', oauthMiddleware, oauth);
joTourism.get('/oauth', faceOauthMiddleware, oauth);

function oauth(req, res) {
  console.log('token => ', req.token);
  res.status(200).json('you successfully signed with facebook');
}



// signin /signup functions:
function signup(req,res){
  let user = new User(req.body);
  user.save()
    .then((dbuser)=>{
      console.log('hashedpass inside sign up',dbuser.pass);
      let user = {
        id: dbuser._id,
      };
      return jwt.sign(user,'ser123');
    })
    .then((token)=>{
      console.log('sign-up token :',token);
      res.status(200).send('successfully sign-up ');
    });
}
function signin (req,res){
  console.log(req.token);
  res.status(200).send('successfully sign-in');

}


//CRUD functions
function getHitsPlaceAtAll(req, res) {
  city.get()
    .then(output => {
      res.status(200).json(output);
    }).catch();
}

function getHitsPlace(req, res) {
  console.log('rrrrrr', req.model);

  city.get(req.params.id)
    .then(output => {
      res.status(200).json(output);
    }).catch();
}

function getHitsSite(req, res) {
  historical.get(req.params.id)
    .then(output => {
      res.status(200).json(output);
    })
    .catch(e => console.error(e));

}

function updateHitsPlace(req, res) {
  city.update(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data);
    }).catch();
}

function updateHitsSite(req, res) {
  historical.update(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data);
    }).catch();
}

function deleteHitsPlace(req, res) {
  let message = 'deleted';
  city.delete(req.params.id)
    .then(() => {
      res.status(200).json(message);
    }).catch();
}

function deleteHitsSite(req, res) {
  let message = 'deleted';
  historical.delete(req.params.id)
    .then(() => {
      res.status(200).json(message);
    }).catch();
}


// function getHitsSiteAtAll(req, res) {
//   historical.get()
//     .then(output => {
//       res.status(200).json(output);
//     }).catch();
// }

// function postHistPlaces(req, res) {
//   city.create(req.body)
//     .then(data => {
//       res.status(201).json(data);
//     })
//     .catch();
// }

// function postHistSite(req, res) {
//   historical.create(req.body)
//     .then(data => {
//       res.status(201).json(data);
//     })
//     .catch();
// }

module.exports = joTourism;
