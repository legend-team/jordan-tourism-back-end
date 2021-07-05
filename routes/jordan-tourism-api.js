'use strict ';

const joTourism = require('express').Router();

const city = require('../models/classes/city_model.js');

const historical =require('../models/classes/hist_model.js');

joTourism.post('/city', postHistPlaces);
joTourism.get('/city/:id',getHitsPlace)
joTourism.get('/city/',getHitsPlaceAtAll)
joTourism.put('/city/:id',updateHitsPlace)
joTourism.delete('/city/:id',deleteHitsPlace)


function getHitsPlaceAtAll(req,res,next){
    city.get()
    .then(output =>{
        res.status(200).json(output)
    }).catch()
}  

function getHitsPlace(req,res,next){
    city.get(req.params.id)
    .then(output =>{
        res.status(200).json(output)
    }).catch()
}
function postHistPlaces(req, res, next){
    // console.log('sssssssssss', req);
 city.create(req.body)
 .then(data => {
     res.status(201).json(data);
 })
 .catch(next)
}

function updateHitsPlace(req, res, next){
city.update(req.params.id, req.body)
.then(data => {
    res.status(200).json(data)
}) .catch(next);
}
function deleteHitsPlace(req, res, next){
    let message = 'deleted';
    city.delete(req.params.id)
    .then(() => {
        res.status(200).json(message)
    }).catch(next);
}

module.exports = joTourism;



