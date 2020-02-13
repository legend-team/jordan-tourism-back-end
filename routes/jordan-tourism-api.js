'use strict ';

const joTourism = require('express').Router();

const city = require('../models/classes/city_model.js');

const historical = require('../models/classes/hist_model.js');




function dynamicModel(req, res, next) {
    // console.log('ssssssssss', req.params.model);
    let model = req.params.model;


    switch (model) {
        case 'amman':
            // console.log('fffffff', req);
            req.model = city;
            next();
            return;

        default:
            next('ssssss');
            return
    }
}

joTourism.param('model', dynamicModel)
joTourism.post('/', postHistPlaces)
joTourism.delete('/:id', deleteHitsPlace)

joTourism.get('/', getHitsPlaceAtAll)
joTourism.post('/:model', postHistPlaces);
joTourism.get('/:model/:id', getHitsPlace)
// joTourism.get('/:model', getHitsPlaceAtAll)
joTourism.put('/:model/:id', updateHitsPlace)
joTourism.delete('/:model/:id', deleteHitsPlace)

function getHitsPlaceAtAll(req, res, next) {
    city.get()
        .then(output => {
            res.status(200).json(output)
        }).catch()
}

function getHitsPlace(req, res, next) {
    city.get(req.params.id)
        .then(output => {
            res.status(200).json(output)
        }).catch()
}
function postHistPlaces(req, res, next) {
    city.create(req.body)
    .then(data => {
        console.log('sssssssssss', data);
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
function deleteHitsPlace(req, res, next) {
    let message = 'deleted';
    city.delete(req.params.id)
        .then(() => {
            res.status(200).json(message)
        }).catch(next);
}

module.exports = joTourism;



